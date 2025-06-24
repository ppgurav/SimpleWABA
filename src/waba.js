const express = require('express');
const { createServer } = require('http');
const mysql = require('mysql2/promise');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const httpServer = createServer(app);    
const path = require('path'); 
const multer = require('multer');
app.use(express.json());

const JWT_SECRET = 'your_super_secure_secret_key';


// === MySQL Pool ===
const pool = mysql.createPool({
  host: '167.71.236.106',
  user: 'root',
  password: 'Samy@1990',
  database: 'CloudAPIWAba',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// === Fetch primary_app entries ===
async function getPrimaryApps() {
  console.log('🔍 [getPrimaryApps] Fetching all primary_app entries...');
  try {
    const [rows] = await pool.query(`SELECT * FROM primary_app`);
    console.log(`✅ Retrieved ${rows.length} primary apps`);
    console.table(rows.map(app => ({ id: app.id, business_id: app.business_id, app_id: app.app_id })));
    return rows;
  } catch (err) {
    console.error('❌ Error fetching primary apps:', err.message);
    return [];
  }
}

async function storeBusinessInfo(business_id, access_token) {
  console.log(`🔍 [storeBusinessInfo] Fetching business info for ID: ${business_id}`);
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v22.0/${business_id}?fields=verification_status,name&access_token=${access_token}`
    );
    const { name, verification_status, id } = res.data;

    console.log(`✅ Business Info Fetched:`, { id, name, verification_status });

    const [result] = await pool.query(`
      INSERT INTO businesses (id, name, verification_status, access_token)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name), 
        verification_status = VALUES(verification_status), 
        access_token = VALUES(access_token)
    `, [id, name, verification_status, access_token]);

    console.log(`📝 Business stored in DB. Affected rows: ${result.affectedRows}`);
  } catch (err) {
    console.error(`❌ Error fetching/storing business info for ID ${business_id}:`, err.message);
  }
}

async function storeWABAs(business_id, access_token) {
  let next = `https://graph.facebook.com/v22.0/${business_id}/client_whatsapp_business_accounts?access_token=${access_token}`;
  let wabaList = [];

  console.log(`\n🔍 [storeWABAs] Fetching client WABAs for Business ID: ${business_id}`);

  while (next) {
    console.log(`[DEBUG] Calling Facebook API: ${next}`);

    try {
      const res = await axios.get(next);
      const { data, paging } = res.data;

      console.log(`[INFO] Retrieved ${data.length} WABAs from current page.`);

      for (const waba of data) {
        let wabaBusinessId = business_id;
        let businessName = null;
        let wabaName = waba.name;
        let verificationStatus = null;

        console.log(`➡️ Processing WABA ID: ${waba.id}, Name: ${wabaName}`);

        try {
          const ownerInfoRes = await axios.get(`https://graph.facebook.com/v22.0/${waba.id}?fields=owner_business_info,name&access_token=${access_token}`);
          const ownerInfo = ownerInfoRes.data.owner_business_info;
          businessName = ownerInfo?.name || null;
          wabaBusinessId = ownerInfo?.id || business_id;

          console.log(`[DEBUG] Owner Info - Business ID: ${wabaBusinessId}, Name: ${businessName}`);

          const verificationRes = await axios.get(`https://graph.facebook.com/v22.0/${wabaBusinessId}?fields=verification_status&access_token=${access_token}`);
          verificationStatus = verificationRes.data?.verification_status || null;

          console.log(`[DEBUG] Verification Status: ${verificationStatus}`);

          await pool.query(`
            INSERT INTO businesses (id, name, verification_status, access_token)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name=VALUES(name), verification_status=VALUES(verification_status), access_token=VALUES(access_token)
          `, [wabaBusinessId, businessName, verificationStatus, access_token]);

          console.log(`[DB] Business saved/updated: ${businessName} (${wabaBusinessId})`);
        } catch (err) {
          console.warn(`⚠️ Failed to fetch owner/verification info for WABA ${waba.id}: ${err.message}`);
        }

        await pool.query(`
          INSERT INTO wabas (id, business_id, name, currency, timezone_id, message_template_namespace)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=VALUES(name), message_template_namespace=VALUES(message_template_namespace)
        `, [waba.id, wabaBusinessId, wabaName, waba.currency || '', waba.timezone_id || '', waba.message_template_namespace || '']);

        console.log(`[DB] WABA saved/updated: ${wabaName} (${waba.id})`);

        wabaList.push({ id: waba.id, name: wabaName });
      }

      next = paging?.next || null;
    } catch (err) {
      console.error(`❌ Error during WABA fetching loop:`, err.message);
      break;
    }
  }

  console.log(`✅ [storeWABAs] Completed storing ${wabaList.length} client WABAs.\n`);
  return wabaList;
}
async function storeOwnWABAs(business_id, access_token) {
  let next = `https://graph.facebook.com/v22.0/${business_id}/owned_whatsapp_business_accounts?access_token=${access_token}`;
  let wabaList = [];

  console.log(`\n🔍 Fetching owned WABAs for Business ID: ${business_id}`);

  while (next) {
    console.log(`[DEBUG] Fetching URL: ${next}`);
    
    const res = await axios.get(next);
    const { data, paging } = res.data;
    console.log(`[INFO] Retrieved ${data.length} WABAs.`);

    for (const waba of data) {
      let wabaBusinessId = business_id;
      let businessName = null;
      let wabaName = waba.name;
      let verificationStatus = null;

      console.log(`➡️ Processing WABA ID: ${waba.id}, Name: ${waba.name}`);

      try {
        const ownerInfoRes = await axios.get(`https://graph.facebook.com/v22.0/${waba.id}?fields=owner_business_info,name&access_token=${access_token}`);
        const ownerInfo = ownerInfoRes.data.owner_business_info;
        businessName = ownerInfo?.name || null;
        wabaBusinessId = ownerInfo?.id || business_id;

        console.log(`[DEBUG] Owner Info - ID: ${wabaBusinessId}, Name: ${businessName}`);

        const verificationRes = await axios.get(`https://graph.facebook.com/v22.0/${wabaBusinessId}?fields=verification_status&access_token=${access_token}`);
        verificationStatus = verificationRes.data?.verification_status || null;

        console.log(`[DEBUG] Verification Status: ${verificationStatus}`);

        await pool.query(`
          INSERT INTO businesses (id, name, verification_status, access_token)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name=VALUES(name), verification_status=VALUES(verification_status), access_token=VALUES(access_token)
        `, [wabaBusinessId, businessName, verificationStatus, access_token]);

        console.log(`[DB] Business saved/updated: ${businessName} (${wabaBusinessId})`);
      } catch (err) {
        console.warn(`⚠️ Could not fetch owner/verification info for WABA ${waba.id}: ${err.message}`);
      }

   const wabaValues = [
  waba.id,
  wabaBusinessId,
  wabaName,
  waba.currency || '',
  waba.timezone_id || '',
  waba.message_template_namespace || ''
];

console.log(`[DEBUG] WABA values to insert/update:`, wabaValues);

await pool.query(`
  INSERT INTO wabas (id, business_id, name, currency, timezone_id, message_template_namespace)
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE name=VALUES(name), message_template_namespace=VALUES(message_template_namespace)
`, wabaValues);

console.log(`[DB] WABA saved/updated: ${wabaName} (${waba.id})`);


      wabaList.push({ id: waba.id, name: wabaName });
    }

    next = paging?.next || null;
  }

  console.log(`✅ Completed storing ${wabaList.length} owned WABAs.\n`);
  return wabaList;
}
async function storePhoneNumbers(wabaList, access_token, token, app_id) {
  for (const waba of wabaList) {
    console.log(`📞 Fetching phone numbers for WABA: ${waba.name} (${waba.id})`);

    try {
      const res = await axios.get(
        `https://graph.facebook.com/v22.0/${waba.id}/phone_numbers`, {
          params: {
            fields: 'verified_name,code_verification_status,display_phone_number,quality_rating,platform_type,throughput_level,last_onboarded_time,webhook_configuration,is_official_business_account,messaging_limit_tier,status',
            access_token
          }
        });

      const phones = res.data.data || [];
      console.log(`[INFO] Found ${phones.length} phone numbers.`);

      for (const phone of phones) {
        console.log(`--> Saving phone: ${phone.display_phone_number}`);

        await pool.query(`
  INSERT INTO phone_numbers (
    id, verified_name, code_verification_status, display_phone_number,
    quality_rating, platform_type, throughput_level, last_onboarded_time,
    webhook_configuration, is_official_business_account,
    whatsapp_business_account_id, waba_name, messaging_limit_tier,
    phone_number_id, token, \`status\`, app_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE display_phone_number = VALUES(display_phone_number)
`, [
  phone.id,
  phone.verified_name || null,
  phone.code_verification_status || null,
  phone.display_phone_number || null,
  phone.quality_rating || null,
  phone.platform_type || null,
  phone.throughput_level || null,
  phone.last_onboarded_time ? new Date(phone.last_onboarded_time.replace('+0000', 'Z')) : null,
  phone.webhook_configuration ? JSON.stringify(phone.webhook_configuration) : null,
  phone.is_official_business_account || false,
  waba.id,
  waba.name,
  phone.messaging_limit_tier || null,
  phone.id,
  token || null,
  phone.status || null,   // ⚠️ Make sure `status` is not a reserved word
  app_id
]);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch phone numbers for WABA ${waba.id}:`, err.message);
    }
  }
}
async function run() {
  try {
    console.log('🚀 Starting WABA sync...');

    const apps = await getPrimaryApps();
    console.log(`[INFO] Found ${apps.length} primary apps.`);

    for (const app of apps) {
      const business_id = app.business_id;
      const access_token = app.access_token;
      const app_id = app.app_id;
      const token = app.waba_token || null;

      console.log(`\n🔄 Processing Business ID: ${business_id}`);

      await storeBusinessInfo(business_id, access_token);
      const wabas = await storeWABAs(business_id, access_token);

      console.log(`[INFO] Found ${wabas.length} WABAs for business ${business_id}`);

      await storePhoneNumbers(wabas, access_token, token, app_id);
    }

    console.log('\n✅ All primary apps processed successfully.\n');
  } catch (error) {
    console.error('❌ Error during WABA sync:', error.message);
  }
}

run();

async function fetchMessageTemplates(wabaId, accessToken) {
  let next = `https://graph.facebook.com/v22.0/${wabaId}/message_templates?access_token=${accessToken}`;

  const conn = await pool.getConnection();
  

  while (next) {
    try {
      const res = await axios.get(next);
      const { data, paging } = res.data;

      for (const template of data) {
        await conn.query(`
          INSERT INTO message_templates (
            id, whatsapp_business_account_id, name, category, language,
            quality_score, status, components, component_data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name), category = VALUES(category), language = VALUES(language),
            quality_score = VALUES(quality_score), status = VALUES(status),
            components = VALUES(components), component_data = VALUES(component_data)
        `, [
          template.id,
          wabaId,
          template.name,
          template.category,
          template.language,
          template.quality_score,
          template.status,
          JSON.stringify(template.components || []),
          JSON.stringify(template || {})
        ]);
      }

      next = paging?.next || null;
    } catch (err) {
      console.error(`❌ Error fetching message templates for WABA ${wabaId}:`, err.message);
      break;
    }
  }

  conn.release();
}

async function fetchAllMessageTemplates() {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT whatsapp_business_account_id AS id, token FROM phone_numbers WHERE token IS NOT NULL`);

    for (const row of rows) {
      const wabaId = row.id;
      const token = row.token;

      console.log(`🔍 Fetching message templates for WABA ID: ${wabaId}`);
      await fetchMessageTemplates(wabaId, token);
    }

    console.log('✅ All message templates fetched.');
  } catch (err) {
    console.error('❌ Error fetching all templates:', err.message);
  }
}
//fetchAllMessageTemplates();

async function fetchTemplateAnalytics(templateId, wabaId, accessToken, start, end) {
  let next = `https://graph.facebook.com/v22.0/${wabaId}/template_analytics?start=${start}&end=${end}&granularity=daily&template_ids=%5B${templateId}%5D&metric_types=sent,delivered,read&access_token=${accessToken}`;

  const analytics = [];

  while (next) {
    try {
      const res = await axios.get(next);
      const dataPoints = res.data?.data?.[0]?.data_points || [];

      analytics.push(...dataPoints);
      next = res.data?.paging?.next || null;
    } catch (err) {
      console.error(`Error fetching analytics for template ${templateId}:`, err.message);
      break;
    }
  }

  return analytics;
}

async function fetchPricingAnalytics(wabaId, accessToken, start, end) {
  const url = `https://graph.facebook.com/v22.0/${wabaId}?fields=pricing_analytics.start(${start}).end(${end}).granularity(DAY)&access_token=${accessToken}`;

  try {
    const res = await axios.get(url);
    const pricingData = res.data?.pricing_analytics?.data || [];

    for (const point of pricingData) {
      await pool.query(`
        INSERT INTO pricing_analytics (
          waba_id, start_ts, end_ts, phone_number, country,
          pricing_category, pricing_type, cost, volume
        ) VALUES (?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          cost = VALUES(cost), volume = VALUES(volume), updated_at = CURRENT_TIMESTAMP
      `, [
        wabaId,
        point.start,
        point.end,
        point.phone_number || null,
        point.country || null,
        point.pricing_category || null,
        point.pricing_type || null,
        point.cost || 0,
        point.volume || 0
      ]);
    }
    return pricingData;
  } catch (err) {
    console.error(`Error fetching pricing analytics for WABA ${wabaId}:`, err.message);
    return [];
  }
}


async function fetchAllTemplateAnalytics() {
  const [rows] = await pool.query(`SELECT DISTINCT whatsapp_business_account_id AS waba_id, id AS template_id FROM message_templates`);

  for (const row of rows) {
    const { waba_id, template_id } = row;

    const [tokenRow] = await pool.query(
      `SELECT token FROM phone_numbers WHERE whatsapp_business_account_id = ? LIMIT 1`,
      [waba_id]
    );

    if (!tokenRow.length) {
      console.warn(`No token found for WABA ID ${waba_id}`);
      continue;
    }

    const token = tokenRow[0].token;

    // Calculate 1-month range
    const end = Math.floor(Date.now() / 1000);
    const start = end - 30 * 24 * 60 * 60;

    console.log(`📊 Fetching analytics for template ${template_id} (WABA: ${waba_id})`);

    const data = await fetchTemplateAnalytics(template_id, waba_id, token, start, end);

    for (const point of data) {
     await pool.query(`
  INSERT INTO template_analytics (
    template_id, waba_id, start_ts, end_ts, sent, delivered, \`read\`
  ) VALUES (?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?, ?)
  ON DUPLICATE KEY UPDATE sent = VALUES(sent), delivered = VALUES(delivered), \`read\` = VALUES(\`read\`)
`, [
  template_id,
  waba_id,
  point.start,
  point.end,
  point.sent || 0,
  point.delivered || 0,
  point.read || 0
]);
    }

    console.log(`💰 Fetching pricing analytics for WABA: ${waba_id}`);

const [enabledRow] = await pool.query(
  `SELECT is_enabled_for_insights FROM wabas WHERE id = ?`,
  [waba_id]
);

if (enabledRow.length && enabledRow[0].is_enabled_for_insights) {
  const pricingData = await fetchPricingAnalytics(waba_id, token, start, end);
  console.log('Pricing analytics:', pricingData);  // ✅ Move this inside the if block
} else {
  console.log(`⚠️ Skipping pricing analytics for WABA: ${waba_id} (insights not enabled)`);
}
    // Example: just logging for now; you can insert into a pricing_analytics table if needed
   
  }
}
//fetchAllTemplateAnalytics();

async function storeConversationAnalytics(wabaId, token, start, end) {
  const url = `https://graph.facebook.com/v22.0/${wabaId}?fields=conversation_analytics.start(${start}).end(${end}).granularity(DAILY).dimensions(["CONVERSATION_CATEGORY","CONVERSATION_TYPE","COUNTRY","PHONE"])&access_token=${token}`;

  try {
    const res = await axios.get(url);
    const dataPoints = res.data?.conversation_analytics?.data?.[0]?.data_points || [];

    for (const point of dataPoints) {
      await pool.query(`
        INSERT INTO conversation_analytics (
          waba_id, phone_number, country, conversation_type,
          conversation_category, start_ts, end_ts, conversation_count, cost
        ) VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?), FROM_UNIXTIME(?), ?, ?)
        ON DUPLICATE KEY UPDATE
          conversation_count = VALUES(conversation_count),
          cost = VALUES(cost),
          updated_at = CURRENT_TIMESTAMP
      `, [
        wabaId,
        point.phone_number,
        point.country,
        point.conversation_type,
        point.conversation_category,
        point.start,
        point.end,
        point.conversation || 0,
        point.cost || 0
      ]);
    }

    console.log(`✅ Stored ${dataPoints.length} analytics records for WABA: ${wabaId}`);
  } catch (err) {
    console.error(`❌ Failed to fetch/store conversation analytics:`, err.message);
  }
}
async function fetchAllConversationAnalytics() {
  const [rows] = await pool.query(`
    SELECT DISTINCT whatsapp_business_account_id AS waba_id, token 
    FROM phone_numbers 
    WHERE token IS NOT NULL
  `);

  const end = Math.floor(Date.now() / 1000);
  const start = end - 30 * 24 * 60 * 60; // last 30 days

  for (const row of rows) {
    const wabaId = row.waba_id;
    const token = row.token;

    console.log(`📊 Fetching conversation analytics for WABA ID: ${wabaId}`);
    await storeConversationAnalytics(wabaId, token, start, end);
  }

  console.log('✅ All conversation analytics processed.');
}

//fetchAllConversationAnalytics();

// Function to check insights status
async function checkInsightsForWABAs() {
  const [rows] = await pool.query(`SELECT DISTINCT whatsapp_business_account_id AS waba_id, token FROM phone_numbers WHERE token IS NOT NULL`);

  for (const row of rows) {
    const { waba_id, token } = row;

    try {
      const url = `https://graph.facebook.com/v22.0/${waba_id}?fields=is_enabled_for_insights&access_token=${token}`;
      const response = await axios.get(url);

      const isEnabled = response.data?.is_enabled_for_insights;
      console.log(`📊 WABA: ${waba_id} | Insights Enabled: ${isEnabled}`);

      // Optional: Store this info into a column if needed
       await pool.query(
        `UPDATE wabas SET is_enabled_for_insights = ? WHERE id = ?`,
        [isEnabled ? 1 : 0, waba_id]
      );

    } catch (error) {
      console.error(`❌ Error for WABA ${waba_id}:`, error.response?.data?.error?.message || error.message);
    }
  }
  console.log('✅ Done checking all WABAs.');
}

//checkInsightsForWABAs();
async function updateCTAStatus() {
  const [templates] = await pool.query(`
    SELECT id AS template_id, category 
    FROM message_templates
  `);

  for (const { template_id, category } of templates) {
    try {
      // Get token for corresponding WABA (linked via token in phone_numbers)
      const [[tokenRow]] = await pool.query(`
        SELECT token FROM phone_numbers 
        WHERE whatsapp_business_account_id = (
          SELECT whatsapp_business_account_id FROM message_templates WHERE id = ?
        ) LIMIT 1
      `, [template_id]);

      if (!tokenRow?.token) {
        console.warn(`🔸 No token found for template ID: ${template_id}`);
        continue;
      }

      const token = tokenRow.token;

      // Fetch tracking status
      const res = await axios.get(
        `https://graph.facebook.com/v22.0/${template_id}?fields=cta_url_link_tracking_opted_out&access_token=${token}`
      );

      const status = res.data.cta_url_link_tracking_opted_out;
      console.log(`🔍 Template ${template_id}: Tracking status = ${status}`);

      // Update DB
      await pool.query(`
        UPDATE message_templates 
        SET cta_url_link_tracking_opted_out = ?
        WHERE id = ?
      `, [status, template_id]);

    } catch (err) {
      console.error(`❌ Failed for template ${template_id}:`, err.response?.data || err.message);
    }
  }

  console.log('✅ Done updating cta_url_link_tracking_opted_out statuses.');
}

//updateCTAStatus();

async function storeQRCodeAction(phoneNumberId, action, data) {
  await pool.query(`
    INSERT INTO whatsapp_qr_codes (
      phone_number_id, code, prefilled_message, deep_link_url, qr_image_url, action, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      prefilled_message = VALUES(prefilled_message),
      deep_link_url = VALUES(deep_link_url),
      qr_image_url = VALUES(qr_image_url),
      action = VALUES(action),
      updated_at = NOW()
  `, [
    phoneNumberId,
    data.code,
    data.prefilled_message,
    data.deep_link_url,
    data.qr_image_url || null,
    action
  ]);
}

async function createQRCode(phoneNumberId, token, message = "Hello!", imageFormat = "SVG") {
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/message_qrdls`;

  try {
    const res = await axios.post(url, {
      prefilled_message: message,
      generate_qr_image: imageFormat
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await storeQRCodeAction(phoneNumberId, 'CREATE', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error creating QR code:", err.response?.data || err.message);
    throw err;
  }
}

async function updateQRCode(phoneNumberId, code, newMessage, token) {
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/message_qrdls`;

  try {
    const res = await axios.post(url, {
      code,
      prefilled_message: newMessage
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await storeQRCodeAction(phoneNumberId, 'UPDATE', res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error updating QR code:", err.response?.data || err.message);
    throw err;
  }
}

async function deleteQRCode(phoneNumberId, code, token) {
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/message_qrdls/${code}`;

  try {
    const res = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await pool.query(`
      UPDATE whatsapp_qr_codes
      SET action = 'DELETE', updated_at = NOW()
      WHERE phone_number_id = ? AND code = ?
    `, [phoneNumberId, code]);

    return res.data;
  } catch (err) {
    console.error("❌ Error deleting QR code:", err.response?.data || err.message);
    throw err;
  }
}

async function fetchAndStoreAllQRCodes(phoneNumberId, token) {
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/message_qrdls`;

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = res.data?.data || [];

    for (const qr of data) {
      await storeQRCodeAction(phoneNumberId, 'EXISTING', qr);
    }

    console.log(`✅ Stored ${data.length} existing QR codes for phone number: ${phoneNumberId}`);
  } catch (err) {
    console.error("❌ Error fetching existing QR codes:", err.response?.data || err.message);
  }
}
async function fetchAndStoreQRCodesForAllPhones() {
  const [rows] = await pool.query(`
    SELECT id AS phone_number_id, token FROM phone_numbers WHERE token IS NOT NULL
  `);

  for (const row of rows) {
    console.log(`📥 Fetching QR codes for: ${row.phone_number_id}`);
    await fetchAndStoreAllQRCodes(row.phone_number_id, row.token);
  }

  console.log("✅ Finished fetching QR codes for all phone numbers.");
}
//fetchAndStoreQRCodesForAllPhones();

/*INSERT INTO CloudAPIWAba.users (
  name, email, mobile, email_verified_at, password,
  remember_token, created_at, updated_at, UserType, waba_id
)
SELECT
  u.name, u.email, u.mobile, u.email_verified_at, u.password,
  u.remember_token, u.created_at, u.updated_at, u.UserType, u.waba_id
FROM waba_saas.users u
WHERE u.waba_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM CloudAPIWAba.wabas w WHERE w.id = u.waba_id
  );
  
  INSERT INTO CloudAPIWAba.api_tokens (token, UserID)
SELECT
  t.token,
  u_new.UserID
FROM waba_saas.api_tokens t
JOIN waba_saas.users u_old ON t.UserID = u_old.UserID
JOIN CloudAPIWAba.users u_new ON u_new.email = u_old.email
WHERE u_old.waba_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM CloudAPIWAba.wabas w WHERE w.id = u_old.waba_id
  );*/
  
  
  const checkUserRole = (allowedRoles) => {
    return (req, res, next) => {
        if (allowedRoles.includes(req.user.UserType)) {
            next();  // If the user's role is allowed, proceed
        } else {
            res.status(403).send('Access denied. Insufficient permissions.');
        }
    };
};

  const validateAccessToken = async (req, res, next) => {
    const { accessToken } = req.query;
    if (!accessToken) {
        return res.status(400).send('Access token is required.');
    }

    try {
        const decodedToken = decodeURIComponent(accessToken).replace(/\s/g, '+');
        const authQuery = `
            SELECT u.UserID, u.UserType
            FROM users u
            JOIN api_tokens atk ON u.UserID = atk.UserID
            WHERE atk.token = ?
        `;
        const [authResults] = await pool.query(authQuery, [decodedToken]);

        if (authResults.length === 0) {
            return res.status(401).send('Invalid access token.');
        }

        req.user = authResults[0];  // Attach the user's details to the request object
        next();  // Continue to the next middleware
    } catch (error) {
        console.error('Authentication failed:', error);
        res.status(500).send('Internal Server Error');
    }
};


  const validateBearerToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('No token provided, or token is invalid.');
    }

    const token = authHeader.split(' ')[1]; // Get the token from 'Bearer YOUR_TOKEN'
    
    try {
        const decodedToken = decodeURIComponent(token).replace(/\s/g, '+');
        const authQuery = `
            SELECT u.UserID, u.UserType
            FROM users u
            JOIN api_tokens atk ON u.UserID = atk.UserID
            WHERE atk.token = ?
        `;
        const [authResults] = await pool.query(authQuery, [decodedToken]);

        if (authResults.length === 0) {
            return res.status(401).send('Invalid token.');
        }

        req.user = authResults[0]; // Attach the user's details to the request object
        next();
    } catch (error) {
        console.error('Token validation failed:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Middleware to check user role
const checkUserRolePost = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.UserType)) {
            next();
        } else {
            return res.status(403).send('Access denied. Insufficient permissions.');
        }
    };
};



async function loginUser(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  try {
    const [users] = await pool.query(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );

    if (users.length === 0) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const [tokens] = await pool.query(
      `SELECT token FROM api_tokens WHERE UserID = ? LIMIT 1`,
      [user.UserID]
    );

    const [phones] = await pool.query(
      `SELECT id AS phone_number_id FROM phone_numbers WHERE whatsapp_business_account_id = ? LIMIT 1`,
      [user.waba_id]
    );

    // ✅ Generate JWT token
    const jwtToken = jwt.sign(
      {
        user_id: user.UserID,
        user_type: user.UserType,
        waba_id: user.waba_id
      },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return {
      success: true,
      token: tokens[0]?.token || null, // Legacy token
      jwt: jwtToken, // ✅ New JWT token
      user_id: user.UserID,
      email: user.email,
      user_type: user.UserType,
      waba_id: user.waba_id,
      phone_number_id: phones[0]?.phone_number_id || null
    };

  } catch (err) {
    console.error('Login error:', err.message);
    return { success: false, message: 'Internal server error.' };
  }
}

// POST /api/users/login endpoint
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});
async function hashAndUpdateAllPasswords() {
  try {
    const [users] = await pool.query(`SELECT UserID, password FROM users`);

    for (const user of users) {
      const isHashed = /^\$2[aby]\$\d{2}\$.{53}$/.test(user.password); // regex to detect bcrypt hash

      if (!isHashed) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await pool.query(
          `UPDATE users SET password = ? WHERE UserID = ?`,
          [hashedPassword, user.UserID]
        );
        console.log(`[UPDATED] UserID ${user.UserID} password hashed.`);
      } else {
        console.log(`[SKIPPED] UserID ${user.UserID} already hashed.`);
      }
    }

    console.log('✅ All plaintext passwords hashed and updated.');
  } catch (error) {
    console.error('❌ Error during password hashing:', error.message);
  }
}
//hashAndUpdateAllPasswords();
const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessTokenFromQuery = req.query.access_token;

  // Prefer Bearer header, fallback to query
  const rawToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : accessTokenFromQuery;

  if (!rawToken) {
    return res.status(401).send('Authorization token is missing or invalid.');
  }

  try {
    // Try to decode JWT
    const decoded = jwt.verify(rawToken, JWT_SECRET);
    req.user = {
      UserID: decoded.user_id,
      UserType: decoded.user_type,
      email: decoded.email,
      waba_id: decoded.waba_id
    };
    return next();
  } catch (jwtError) {
    // If JWT fails, try legacy API token
    try {
      const decodedToken = decodeURIComponent(rawToken).replace(/\s/g, '+');

      const [rows] = await pool.query(`
        SELECT u.UserID, u.UserType, u.email, u.waba_id
        FROM users u
        JOIN api_tokens atk ON u.UserID = atk.UserID
        WHERE atk.token = ?
      `, [decodedToken]);

      if (rows.length === 0) {
        return res.status(401).send('Invalid token.');
      }

      req.user = rows[0];
      next();
    } catch (dbError) {
      console.error('Token validation failed:', dbError.message);
      res.status(500).send('Internal server error during token validation.');
    }
  }
};

// GET /api/templates route
app.get('/api/templates', validateToken, async (req, res) => {
  const { UserType, waba_id } = req.user;

  let query = `SELECT * FROM message_templates`;
  let params = [];

  // Only filter by waba_id if not Super Admin
  if (UserType !== 'Super Admin') {
    query += ` WHERE whatsapp_business_account_id = ?`;
    params.push(waba_id);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      templates: rows
    });
  } catch (err) {
    console.error('❌ Error fetching templates:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch templates' });
  }
});







app.get('/api/contacts', validateToken, async (req, res) => {
  const { UserType, waba_id, UserID } = req.user;
  let query = 'SELECT * FROM tbl_contacts WHERE is_deleted = 0';
  let params = [];

  if (UserType === 'Admin') {
    query += ' AND waba_id = ?';
    params.push(waba_id);
  } else if (UserType === 'Agent') {
    query += ' AND group_id IN (SELECT group_id FROM group_agents WHERE agent_id = ?)';
    params.push(UserID);
  }

  try {
    const [contacts] = await pool.query(query, params);
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

app.post('/api/contacts', validateToken, async (req, res) => {
  const { name, phone, group_id, email } = req.body;
  const { waba_id } = req.user;

  try {
    await pool.query(`
      INSERT INTO tbl_contacts (name, phone, email, group_id, waba_id)
      VALUES (?, ?, ?, ?, ?)
    `, [name, phone, email, group_id, waba_id]);
    res.json({ success: true, message: 'Contact added successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add contact' });
  }
});

app.put('/api/contacts/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const { name, phone, group_id, email } = req.body;

  try {
    await pool.query(`
      UPDATE tbl_contacts SET name = ?, phone = ?, email = ?, group_id = ? WHERE id = ?
    `, [name, phone, email, group_id, id]);
    res.json({ success: true, message: 'Contact updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update contact' });
  }
});

app.delete('/api/contacts/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE tbl_contacts SET is_deleted = 1 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Contact soft deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete contact' });
  }
});

const upload = multer({ dest: 'uploads/' });

app.post('/api/contacts/import', validateToken, upload.single('file'), async (req, res) => {
  const results = [];
  const { waba_id } = req.user;

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        for (const contact of results) {
          await pool.query(`
            INSERT INTO tbl_contacts (name, phone, email, group_id, waba_id)
            VALUES (?, ?, ?, ?, ?)
          `, [contact.name, contact.phone, contact.email, contact.group_id, waba_id]);
        }
        res.json({ success: true, message: 'Contacts imported successfully.' });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to import contacts' });
      }
    });
});

app.get('/api/contacts/export', validateToken, async (req, res) => {
  const format = req.query.format || 'csv';

  try {
    const [contacts] = await pool.query('SELECT * FROM tbl_contacts WHERE is_deleted = 0');

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Contacts');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Group ID', key: 'group_id', width: 15 },
      ];

      worksheet.addRows(contacts);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // Default to CSV
      const csvHeader = 'ID,Name,Phone,Email,Group ID\n';
      const csvData = contacts.map(row => `${row.id},${row.name},${row.phone},${row.email},${row.group_id}`).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
      res.send(csvHeader + csvData);
    }
  } catch (err) {
    console.error('Export failed:', err.message);
    res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

app.get('/api/contacts/import-template/csv', validateToken, (req, res) => {
  const headers = ['name', 'phone', 'email', 'group_id'];
  const sampleRow = ['John Doe', '9876543210', 'john@example.com', '1'];

  const csvContent = `${headers.join(',')}\n${sampleRow.join(',')}\n`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contact_import_template.csv"');
  res.send(csvContent);
});

app.get('/api/contacts/import-template/excel', validateToken, async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Contacts Template');

  sheet.columns = [
    { header: 'name', key: 'name', width: 25 },
    { header: 'phone', key: 'phone', width: 15 },
    { header: 'email', key: 'email', width: 30 },
    { header: 'group_id', key: 'group_id', width: 10 },
  ];

  sheet.addRow({ name: 'John Doe', phone: '9876543210', email: 'john@example.com', group_id: 1 });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="contact_import_template.xlsx"');
  await workbook.xlsx.write(res);
  res.end();
});



// GROUPS API
app.get('/api/groups', validateToken, async (req, res) => {
  const { waba_id } = req.user;
  try {
    const [groups] = await pool.query(`SELECT * FROM tbl_group WHERE waba_id = ? AND is_deleted = 0`, [waba_id]);
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch groups' });
  }
});

app.post('/api/groups', validateToken, async (req, res) => {
  const { name } = req.body;
  const { waba_id } = req.user;
  try {
    await pool.query(`INSERT INTO tbl_group (name, waba_id) VALUES (?, ?)`, [name, waba_id]);
    res.json({ success: true, message: 'Group added successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add group' });
  }
});

app.put('/api/groups/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await pool.query(`UPDATE tbl_group SET name = ? WHERE id = ?`, [name, id]);
    res.json({ success: true, message: 'Group updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update group' });
  }
});

app.delete('/api/groups/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE tbl_group SET is_deleted = 1 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Group soft deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete group' });
  }
});







// TAGS API
app.get('/api/tags', validateToken, async (req, res) => {
  const { waba_id } = req.user;
  try {
    const [tags] = await pool.query(`SELECT * FROM tbl_tag WHERE waba_id = ? AND is_deleted = 0`, [waba_id]);
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch tags' });
  }
});

app.post('/api/tags', validateToken, async (req, res) => {
  const { name } = req.body;
  const { waba_id } = req.user;
  try {
    await pool.query(`INSERT INTO tbl_tag (name, waba_id) VALUES (?, ?)`, [name, waba_id]);
    res.json({ success: true, message: 'Tag added successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add tag' });
  }
});

app.put('/api/tags/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await pool.query(`UPDATE tbl_tag SET name = ? WHERE id = ?`, [name, id]);
    res.json({ success: true, message: 'Tag updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update tag' });
  }
});

app.delete('/api/tags/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`UPDATE tbl_tag SET is_deleted = 1 WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Tag soft deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete tag' });
  }
});


app.post('/api/assign-group', validateToken, async (req, res) => {
  const { agent_id, group_ids } = req.body;
  try {
    await pool.query('DELETE FROM agent_group_map WHERE agent_id = ?', [agent_id]);
    for (const group_id of group_ids) {
      await pool.query('INSERT INTO agent_group_map (agent_id, group_id) VALUES (?, ?)', [agent_id, group_id]);
    }
    res.json({ success: true, message: 'Groups assigned to agent successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to assign groups.' });
  }
});

app.get('/api/agent-groups/:agent_id', validateToken, async (req, res) => {
  const { agent_id } = req.params;
  try {
    const [groups] = await pool.query(`
      SELECT g.* FROM tbl_group g
      JOIN agent_group_map agm ON g.id = agm.group_id
      WHERE agm.agent_id = ? AND g.is_deleted = 0
    `, [agent_id]);
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch agent groups.' });
  }
});

// Start server
// Start the HTTP server
httpServer.listen(3001, () => {
  console.log('HTTP Server running on http://localhost:3001');
});
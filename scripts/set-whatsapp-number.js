/**
 * Script to set WhatsApp business number in database
 * Usage: node scripts/set-whatsapp-number.js <phone-number>
 * Example: node scripts/set-whatsapp-number.js "+919876543210"
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setWhatsAppNumber() {
  const phoneNumber = process.argv[2];

  if (!phoneNumber) {
    console.error('❌ Error: Please provide a WhatsApp number');
    console.log('\nUsage: node scripts/set-whatsapp-number.js <phone-number>');
    console.log('Example: node scripts/set-whatsapp-number.js "+919876543210"');
    console.log('Example: node scripts/set-whatsapp-number.js "919876543210"');
    process.exit(1);
  }

  try {
    // Check if setting exists
    const existing = await prisma.business_settings.findUnique({
      where: { setting_key: 'whatsapp_business_number' }
    });

    if (existing) {
      // Update existing
      await prisma.business_settings.update({
        where: { setting_key: 'whatsapp_business_number' },
        data: {
          setting_value: phoneNumber,
          updated_at: new Date()
        }
      });
      console.log(`✅ Updated WhatsApp number: ${phoneNumber}`);
    } else {
      // Create new
      await prisma.business_settings.create({
        data: {
          setting_key: 'whatsapp_business_number',
          setting_value: phoneNumber,
          description: 'WhatsApp business number for receiving orders'
        }
      });
      console.log(`✅ Created WhatsApp number: ${phoneNumber}`);
    }

    // Verify
    const verify = await prisma.business_settings.findUnique({
      where: { setting_key: 'whatsapp_business_number' }
    });
    console.log(`\n📱 Current WhatsApp number: ${verify.setting_value}`);
    console.log(`\n✅ WhatsApp number is now configured!`);
    console.log(`   Users can now click the WhatsApp button to contact you.`);

  } catch (error) {
    console.error('❌ Error setting WhatsApp number:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setWhatsAppNumber();


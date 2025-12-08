const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkWhatsAppNumber() {
  try {
    const setting = await prisma.business_settings.findUnique({
      where: { setting_key: 'whatsapp_business_number' }
    });

    if (setting) {
      console.log('✅ WhatsApp number is configured:');
      console.log(`   ${setting.setting_value}`);
    } else {
      console.log('❌ WhatsApp number is NOT configured');
      console.log('\nTo set it up, run:');
      console.log('   node scripts/set-whatsapp-number.js "+919876543210"');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkWhatsAppNumber();


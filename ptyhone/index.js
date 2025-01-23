const { execSync } = require('child_process');

function getWifiProfiles() {
    try {
        // MacOS uchun Wi-Fi tarmoqlarini ko'rish
        const data = execSync('networksetup -listpreferredwirelessnetworks en0', { encoding: 'utf-8' });
        const profiles = data.split('\n')
            .slice(1)  // Birinchi qatorni (manba interfeys haqida) tashlab o'tamiz
            .map(line => line.trim())
            .filter(line => line.length > 0); // Bo'sh qatorlarni tashlab o'tamiz

        return profiles;
    } catch (err) {
        console.error('Wi-Fi profillarini olishda xato:', err.message);
        return [];
    }
}

function getWifiPassword(profile) {
    try {
        // MacOS-da Wi-Fi parolini olish uchun security buyrug'idan foydalanish
        const result = execSync(`security find-generic-password -D "AirPort network password" -a "${profile}" -w`, { encoding: 'utf-8' });
        return result.trim();
    } catch (err) {
        return 'Parol mavjud emas yoki olishda xato';
    }
}

// Barcha profillarni chiqarish va parollarini olish
const profiles = getWifiProfiles();

profiles.forEach(profile => {
    const password = getWifiPassword(profile);
    console.log(`${profile.padEnd(30)} | ${password}`);
});

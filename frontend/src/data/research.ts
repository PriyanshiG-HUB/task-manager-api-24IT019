import type { Research } from '@/types'

export const research: Research = {
  title: 'IoT-Driven RFID-Based Real-Time Attendance System',
  conference:
    '10th International Conference on Smart Trends in Computing and Communications (SmartCom 2026)',
  publisher: 'Springer Nature',
  year: '2026',
  authors: ['Hardi Vekariya', 'Priyanshi Gajiwala', 'Aneri Pandya', 'Killol Pandya'],
  location: 'Pune, India',
  conferenceDates: 'January 19 – 21, 2026',
  abstract:
    'This paper presents an IoT-enabled attendance management system leveraging ESP32 microcontrollers and RFID (RC522) technology for secure, real-time authentication. The system integrates hardware-software workflows with automated cloud synchronization via Google Sheets API, enabling centralized attendance tracking while eliminating proxy attendance and manual intervention.',
  problem:
    'Traditional attendance systems rely on manual roll calls and paper-based records, leading to proxy attendance, data inconsistencies, and lack of real-time visibility for administrators in campus environments.',
  architecture:
    'A three-tier architecture comprising RFID hardware layer (ESP32 + RC522), middleware processing layer for authentication and validation, and cloud synchronization layer using Google Sheets API for centralized data management.',
  esp32Integration:
    'ESP32 microcontrollers serve as the core processing unit, handling RFID tag reads, real-time authentication logic, Wi-Fi connectivity, and bidirectional communication with cloud services for attendance logging.',
  rfidAuth:
    'RC522 RFID modules perform contactless card/tag authentication with unique identifier validation, ensuring secure and tamper-resistant attendance marking with sub-second response times.',
  googleSheetsSync:
    'Automated cloud synchronization pushes attendance records to Google Sheets in real-time, providing administrators with instant visibility, export capabilities, and integration with existing campus management workflows.',
  outcomes: [
    'Eliminated proxy attendance through hardware-software integration',
    'Reduced manual intervention with automated real-time validation',
    'Achieved cost-effective, scalable deployment for smart campus environments',
    'Presented research at SmartCom 2026 under guidance of Dr. Aneri Pandya and Dr. Killol Pandya',
    'Selected for publication by Springer Nature proceedings',
  ],
  downloadUrl: '/resume.pdf',
  certificateImage: '/research/smartcom-2026-certificate.png',
}

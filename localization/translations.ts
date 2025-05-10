export const translations = {
  en: {
    // Common text
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      loading: 'Loading...',
      seeAll: 'See All',
      dismiss: 'Dismiss',
    },
    
    // Splash screen
    splash: {
      scanning: 'Scanning for threats...',
    },
    
    // Tabs
    tabs: {
      home: 'Home',
      scan: 'Scan',
      report: 'Report',
      history: 'History',
      settings: 'Settings',
    },
    
    // Home screen
    home: {
      title: 'FouziRadar DZ',
      subtitle: 'Protecting you from digital threats',
      scanSMS: 'Scan SMS',
      reportThreat: 'Report Threat',
      latestThreats: 'Latest Threats',
      noThreats: 'No threats detected recently',
    },
    
    // Status card
    status: {
      deviceSafe: 'Your Device is Safe',
      noThreatsFound: 'No threats detected. We\'ll keep monitoring.',
      threatDetected: 'Suspicious Activity Detected',
      actionRequired: 'Please review and take action.',
      permissionNeeded: 'SMS Permission Required',
      permissionDescription: 'We need access to scan your SMS messages for potential threats.',
      grantAccess: 'Grant Access',
    },
    
    // Scan screen
    scan: {
      title: 'Scan Messages',
      subtitle: 'Check your SMS for phishing attempts',
      ready: 'Ready to scan your messages',
      startScan: 'Start Scan',
      sendReport: 'Send Report',
      threatsFound: '{{count}} threats found',
      noThreatsFound: 'No threats detected',
      detectedThreats: 'Detected Threats',
      phishingDetected: 'Phishing Detected',
      permissionRequired: 'Permission Required',
      permissionDescription: 'FouziRadar needs access to your SMS messages to scan for threats.',
      grantPermission: 'Grant Permission',
      progress: {
        checking: 'Checking messages...',
        analyzing: 'Analyzing content...',
        finalizing: 'Finalizing results...',
      },
    },
    
    // Report screen
    report: {
      title: 'Report a Threat',
      subtitle: 'Help protect others by reporting suspicious links',
      suspiciousLink: 'Suspicious Link',
      urlPlaceholder: 'Enter URL (https://...)',
      description: 'Description (Optional)',
      descriptionPlaceholder: 'Briefly describe the threat...',
      submit: 'Send Report',
      success: 'Report Sent!',
      invalidUrl: 'Please enter a valid URL',
      errorTitle: 'Error',
      error: 'Failed to send report. Please try again.',
      infoNotice: 'Your report will be sent to our analysts and help protect others.',
    },
    
    // History screen
    history: {
      title: 'Threat History',
      all: 'All',
      detected: 'Detected',
      reported: 'Reported',
      today: 'Today',
      yesterday: 'Yesterday',
      noThreatsTitle: 'No Threats Found',
      noThreatsMessage: 'Your history is clean. We\'ll keep monitoring for threats.',
    },
    
    // Settings screen
    settings: {
      title: 'Settings',
      appearance: 'APPEARANCE',
      darkMode: 'Dark Mode',
      language: 'Language',
      detection: 'DETECTION',
      autoReport: 'Auto-Report Threats',
      permissions: 'SMS Permission',
      granted: 'Granted',
      required: 'Required',
      keywordSource: 'Keyword Source',
      support: 'SUPPORT',
      contactSupport: 'Contact Support',
      about: 'About FouziRadar',
      webNotSupported: 'This feature is not available on web',
    },
    
    // Threat item
    threat: {
      detected: 'Detected',
      reported: 'Reported',
    },
    
    // Threat detail
    threatDetail: {
      title: 'Threat Details',
      content: 'Content',
      description: 'Description',
      matchedKeywords: 'Matched Keywords',
      share: 'Share',
      delete: 'Delete',
      notFound: 'Threat not found',
      detectedThreat: 'Detected Threat',
      reportedThreat: 'Reported Threat',
    },
    
    // Share
    share: {
      threatDetected: 'Potential threat detected',
    },
  },
  
  ar: {
    // Common text
    common: {
      ok: 'موافق',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      loading: 'جاري التحميل...',
      seeAll: 'عرض الكل',
      dismiss: 'إغلاق',
    },
    
    // Splash screen
    splash: {
      scanning: 'جاري البحث عن التهديدات...',
    },
    
    // Tabs
    tabs: {
      home: 'الرئيسية',
      scan: 'فحص',
      report: 'إبلاغ',
      history: 'السجل',
      settings: 'الإعدادات',
    },
    
    // Home screen
    home: {
      title: 'FouziRadar DZ',
      subtitle: 'حمايتك من التهديدات الرقمية',
      scanSMS: 'فحص الرسائل',
      reportThreat: 'الإبلاغ عن تهديد',
      latestThreats: 'أحدث التهديدات',
      noThreats: 'لم يتم اكتشاف تهديدات مؤخرًا',
    },
    
    // Status card
    status: {
      deviceSafe: 'جهازك آمن',
      noThreatsFound: 'لم يتم اكتشاف تهديدات. سنواصل المراقبة.',
      threatDetected: 'تم اكتشاف نشاط مشبوه',
      actionRequired: 'يرجى المراجعة واتخاذ إجراء.',
      permissionNeeded: 'إذن الرسائل مطلوب',
      permissionDescription: 'نحتاج إلى الوصول لفحص رسائلك بحثًا عن تهديدات محتملة.',
      grantAccess: 'منح الإذن',
    },
    
    // Scan screen
    scan: {
      title: 'فحص الرسائل',
      subtitle: 'تحقق من رسائلك بحثًا عن محاولات التصيد',
      ready: 'جاهز لفحص رسائلك',
      startScan: 'بدء الفحص',
      sendReport: 'إرسال تقرير',
      threatsFound: 'تم العثور على {{count}} تهديدات',
      noThreatsFound: 'لم يتم اكتشاف تهديدات',
      detectedThreats: 'التهديدات المكتشفة',
      phishingDetected: 'تم اكتشاف تصيد',
      permissionRequired: 'الإذن مطلوب',
      permissionDescription: 'يحتاج فوزي رادار إلى الوصول إلى رسائلك للبحث عن التهديدات.',
      grantPermission: 'منح الإذن',
      progress: {
        checking: 'جاري فحص الرسائل...',
        analyzing: 'جاري تحليل المحتوى...',
        finalizing: 'إنهاء النتائج...',
      },
    },
    
    // Report screen
    report: {
      title: 'الإبلاغ عن تهديد',
      subtitle: 'ساعد في حماية الآخرين من خلال الإبلاغ عن الروابط المشبوهة',
      suspiciousLink: 'رابط مشبوه',
      urlPlaceholder: 'أدخل الرابط (https://...)',
      description: 'الوصف (اختياري)',
      descriptionPlaceholder: 'صف التهديد باختصار...',
      submit: 'إرسال التقرير',
      success: 'تم الإرسال!',
      invalidUrl: 'يرجى إدخال رابط صالح',
      errorTitle: 'خطأ',
      error: 'فشل إرسال التقرير. حاول مرة أخرى.',
      infoNotice: 'سيتم إرسال تقريرك إلى محللينا وسيساعد على حماية الآخرين.',
    },
    
    // History screen
    history: {
      title: 'سجل التهديدات',
      all: 'الكل',
      detected: 'مكتشفة',
      reported: 'مبلغ عنها',
      today: 'اليوم',
      yesterday: 'الأمس',
      noThreatsTitle: 'لم يتم العثور على تهديدات',
      noThreatsMessage: 'سجلك نظيف. سنواصل مراقبة التهديدات.',
    },
    
    // Settings screen
    settings: {
      title: 'الإعدادات',
      appearance: 'المظهر',
      darkMode: 'الوضع الداكن',
      language: 'اللغة',
      detection: 'الكشف',
      autoReport: 'إبلاغ تلقائي عن التهديدات',
      permissions: 'إذن الرسائل',
      granted: 'ممنوح',
      required: 'مطلوب',
      keywordSource: 'مصدر الكلمات الرئيسية',
      support: 'الدعم',
      contactSupport: 'اتصل بالدعم',
      about: 'حول فوزي رادار',
      webNotSupported: 'هذه الميزة غير متوفرة على الويب',
    },
    
    // Threat item
    threat: {
      detected: 'مكتشف',
      reported: 'مبلغ عنه',
    },
    
    // Threat detail
    threatDetail: {
      title: 'تفاصيل التهديد',
      content: 'المحتوى',
      description: 'الوصف',
      matchedKeywords: 'الكلمات المطابقة',
      share: 'مشاركة',
      delete: 'حذف',
      notFound: 'لم يتم العثور على التهديد',
      detectedThreat: 'تهديد مكتشف',
      reportedThreat: 'تهديد مبلغ عنه',
    },
    
    // Share
    share: {
      threatDetected: 'تم اكتشاف تهديد محتمل',
    },
  },
};
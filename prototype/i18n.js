/**
 * i18n v1.0 — vanilla JS internationalization engine
 * Uses data-i18n attributes on DOM elements.
 * Dictionary keys are the English default text (lowercased, trimmed).
 * Usage: <span data-i18n>earning · live</span>
 *        initI18n(); // reads language from localStorage, applies translations
 */
(function(global){
'use strict';

// ── Translation dictionaries ────────────────────────────
// Key = English default text (as it appears in HTML)
var DICT = {
  'zh-CN': {
    // ── Nav ──
    'CLOCK': '时钟',
    'CALENDAR': '日历',
    'SETTINGS': '设置',

    // ── Login ──
    'create your account': '创建你的账号',
    'continue your session': '继续你的会话',
    'your name': '你的名字',
    'Enter': '进入',
    'or continue as': '或继续作为',
    'Switch account': '切换账号',

    // ── Clock ──
    'waiting': '等待中',
    'earning': '赚取中',
    'paused': '已暂停',
    'done': '已下班',
    'overtime': '加班中',
    'rest day': '休息日',
    'day off': '休息日',
    'earning · live': '赚取中 · 实时',
    'today · paused': '今日 · 已暂停',
    'today · done': '今日 · 已下班',
    'today · completed': '今日 · 已完成',
    'today · overtime': '今日 · 加班中',
    'base + ot · live': '基本 + 加班 · 实时',
    'total · completed': '合计 · 已完成',
    'rest day · no earnings': '休息日 · 无收入',
    'work paused': '工作已暂停',
    'work starts in': '距开始还有',
    'work starts now': '开始工作了',
    'work day complete': '今日工作完成',
    'h ': '时 ',
    'm worked today': '分 今日已工作',
    '⏸ pause': '⏸ 暂停',
    '▶ resume': '▶ 继续',
    'start overtime': '开始加班',
    'stop overtime': '停止加班',
    'resume overtime': '继续加班',
    'today': '今日',
    '/ sec': '/ 秒',

    // ── Calendar ──
    'this month': '本月',
    'all time': '累计',
    'Custom income…': '自定义收入…',
    '+ Add': '+ 添加',
    'add one-time income to today': '为今天添加一次性收入',
    'M': '一',
    'T': '二',
    'W': '三',
    'F': '五',
    'S': '六',

    // ── Setup ──
    'SETTINGS': '设置',
    'configure your wage clock': '配置你的时薪钟',
    'your current settings': '你的当前设置',
    'Monthly Salary': '月薪',
    'Work Schedule': '工作制度',
    'Work Hours': '工作时间',
    'Overtime': '加班',
    'Per-second Rate': '每秒薪资',
    'Language / 语言': '语言',
    'Currency / 币种': '币种',
    'Edit Settings': '编辑设置',
    '⇄  Switch Account': '⇄  切换账号',
    'Select Language / 选择语言': '选择语言',
    'Select Currency / 选择币种': '选择币种',
    'Save & Start →': '保存并开始 →',
    'Next →': '下一步 →',
    '← Back': '← 返回',
    'Monthly Salary': '月薪',
    'Work Schedule': '工作制度',
    'Work Hours': '工作时间',
    '5-day (dual rest)': '双休',
    '5.5-day (alternating)': '大小周',
    '6-day (single rest)': '单休',
    'tap to toggle rest days': '点击切换休息日',
    'This Saturday:': '本周六：',
    'work': '上班',
    'rest': '休息',
    'Start': '开始',
    'End': '结束',
    'Overtime Rate': '加班费率',
    'Multiplier': '倍率',
    'Base Rate': '基础费率',
    'Custom': '自定义',
    'currency': '币种',
    'hr': '小时',
    'sec': '秒',
    'once': '次',
    'Mon': '周一',
    'Tue': '周二',
    'Wed': '周三',
    'Thu': '周四',
    'Fri': '周五',
    'Sat': '周六',
    'Sun': '周日',
  },

  'en': {
    // English is the default — most keys map to themselves.
    // Only override where the HTML default differs from desired English.
    'M': 'M', 'T': 'T', 'W': 'W', 'F': 'F', 'S': 'S',
  },

  'ja': {
    'CLOCK': '時計',
    'CALENDAR': 'カレンダー',
    'SETTINGS': '設定',
    'create your account': 'アカウントを作成',
    'continue your session': 'セッションを続行',
    'your name': '名前',
    'Enter': '入る',
    'or continue as': 'または次のユーザーで続行',
    'Switch account': 'アカウント切替',
    'waiting': '待機中',
    'earning': ' earning',
    'paused': '一時停止',
    'done': '終了',
    'overtime': '残業中',
    'rest day': '休日',
    'day off': '休日',
    'earning · live': ' earning · リアルタイム',
    'today · paused': '今日 · 一時停止',
    'today · done': '今日 · 終了',
    'today · completed': '今日 · 完了',
    'today · overtime': '今日 · 残業中',
    'base + ot · live': '基本 + 残業 · リアルタイム',
    'total · completed': '合計 · 完了',
    'rest day · no earnings': '休日 · 収入なし',
    'work paused': '一時停止中',
    'work starts in': '開始まで',
    'work starts now': '仕事開始',
    'work day complete': '本日の勤務終了',
    'h ': '時間 ',
    'm worked today': '分 本日勤務',
    '⏸ pause': '⏸ 一時停止',
    '▶ resume': '▶ 再開',
    'start overtime': '残業開始',
    'stop overtime': '残業終了',
    'resume overtime': '残業再開',
    'today': '今日',
    '/ sec': '/ 秒',
    'this month': '今月',
    'all time': '累計',
    'Custom income…': 'カスタム収入…',
    '+ Add': '+ 追加',
    'configure your wage clock': '時給時計を設定',
    'your current settings': '現在の設定',
    'Monthly Salary': '月給',
    'Work Schedule': '勤務形態',
    'Work Hours': '勤務時間',
    'Overtime': '残業',
    'Per-second Rate': '毎秒レート',
    'Language / 语言': '言語',
    'Currency / 币种': '通貨',
    'Edit Settings': '設定を編集',
    '⇄  Switch Account': '⇄  アカウント切替',
    'Select Language / 选择语言': '言語を選択',
    'Select Currency / 选择币种': '通貨を選択',
    'Save & Start →': '保存して開始 →',
    'Next →': '次へ →',
    '← Back': '← 戻る',
    '5-day (dual rest)': '週5日（完全週休二日）',
    '5.5-day (alternating)': '週5.5日（隔週）',
    '6-day (single rest)': '週6日（週休一日）',
    'tap to toggle rest days': 'タップで休日を切替',
    'This Saturday:': '今週の土曜：',
    'work': '出勤',
    'rest': '休み',
    'Start': '開始',
    'End': '終了',
    'Overtime Rate': '残業レート',
    'Multiplier': '倍率',
    'Base Rate': '基本レート',
    'Custom': 'カスタム',
    'currency': '通貨',
    'Mon': '月', 'Tue': '火', 'Wed': '水', 'Thu': '木',
    'Fri': '金', 'Sat': '土', 'Sun': '日',
    'M': '月', 'T': '火', 'W': '水', 'F': '金', 'S': '土',
  },

  'ko': {
    'CLOCK': '시계',
    'CALENDAR': '달력',
    'SETTINGS': '설정',
    'create your account': '계정 만들기',
    'continue your session': '세션 계속하기',
    'your name': '이름',
    'Enter': '입장',
    'or continue as': '다음 사용자로 계속',
    'Switch account': '계정 전환',
    'waiting': '대기 중',
    'earning': '수익 중',
    'paused': '일시정지',
    'done': '완료',
    'overtime': '야근 중',
    'rest day': '휴일',
    'day off': '휴일',
    'earning · live': '수익 중 · 실시간',
    'today · paused': '오늘 · 일시정지',
    'today · done': '오늘 · 완료',
    'today · completed': '오늘 · 완료',
    'today · overtime': '오늘 · 야근 중',
    'base + ot · live': '기본 + 야근 · 실시간',
    'total · completed': '합계 · 완료',
    'rest day · no earnings': '휴일 · 수익 없음',
    'work paused': '일시정지됨',
    'work starts in': '시작까지',
    'work starts now': '업무 시작',
    'work day complete': '금일 업무 완료',
    'h ': '시간 ',
    'm worked today': '분 금일근무',
    '⏸ pause': '⏸ 일시정지',
    '▶ resume': '▶ 계속',
    'start overtime': '야근 시작',
    'stop overtime': '야근 종료',
    'resume overtime': '야근 계속',
    'today': '오늘',
    '/ sec': '/ 초',
    'this month': '이번 달',
    'all time': '누적',
    'Custom income…': '사용자 수입…',
    '+ Add': '+ 추가',
    'configure your wage clock': '시급 시계 설정',
    'your current settings': '현재 설정',
    'Monthly Salary': '월급',
    'Work Schedule': '근무 형태',
    'Work Hours': '근무 시간',
    'Overtime': '야근',
    'Per-second Rate': '초당 수익',
    'Language / 语言': '언어',
    'Currency / 币种': '통화',
    'Edit Settings': '설정 편집',
    '⇄  Switch Account': '⇄  계정 전환',
    'Select Language / 选择语言': '언어 선택',
    'Select Currency / 选择币种': '통화 선택',
    'Save & Start →': '저장 후 시작 →',
    'Next →': '다음 →',
    '← Back': '← 돌아가기',
    '5-day (dual rest)': '주5일 (주2일 휴무)',
    '5.5-day (alternating)': '주5.5일 (격주)',
    '6-day (single rest)': '주6일 (주1일 휴무)',
    'tap to toggle rest days': '탭하여 휴일 전환',
    'This Saturday:': '이번 주 토요일:',
    'work': '출근',
    'rest': '휴식',
    'Start': '시작',
    'End': '종료',
    'Overtime Rate': '야근 수당',
    'Multiplier': '배율',
    'Base Rate': '기본 요율',
    'Custom': '사용자 지정',
    'currency': '통화',
    'Mon': '월', 'Tue': '화', 'Wed': '수', 'Thu': '목',
    'Fri': '금', 'Sat': '토', 'Sun': '일',
    'M': '월', 'T': '화', 'W': '수', 'F': '금', 'S': '토',
  },

  'zh-TW': {
    'CLOCK': '時鐘',
    'CALENDAR': '日曆',
    'SETTINGS': '設定',
    'create your account': '建立你的帳號',
    'continue your session': '繼續你的工作階段',
    'your name': '你的名字',
    'Enter': '進入',
    'or continue as': '或繼續作為',
    'Switch account': '切換帳號',
    'waiting': '等待中',
    'earning': '賺取中',
    'paused': '已暫停',
    'done': '已下班',
    'overtime': '加班中',
    'rest day': '休息日',
    'day off': '休息日',
    'earning · live': '賺取中 · 即時',
    'today · paused': '今日 · 已暫停',
    'today · done': '今日 · 已下班',
    'today · completed': '今日 · 已完成',
    'today · overtime': '今日 · 加班中',
    'base + ot · live': '基本 + 加班 · 即時',
    'total · completed': '合計 · 已完成',
    'rest day · no earnings': '休息日 · 無收入',
    'work paused': '工作已暫停',
    'work starts in': '距開始還有',
    'work starts now': '開始工作了',
    'work day complete': '今日工作完成',
    'h ': '時 ',
    'm worked today': '分 今日已工作',
    '⏸ pause': '⏸ 暫停',
    '▶ resume': '▶ 繼續',
    'start overtime': '開始加班',
    'stop overtime': '停止加班',
    'resume overtime': '繼續加班',
    'today': '今日',
    '/ sec': '/ 秒',
    'this month': '本月',
    'all time': '累計',
    'Custom income…': '自訂收入…',
    '+ Add': '+ 新增',
    'configure your wage clock': '設定你的時薪鐘',
    'your current settings': '你的目前設定',
    'Monthly Salary': '月薪',
    'Work Schedule': '工作制度',
    'Work Hours': '工作時間',
    'Overtime': '加班',
    'Per-second Rate': '每秒薪資',
    'Language / 语言': '語言',
    'Currency / 币种': '幣種',
    'Edit Settings': '編輯設定',
    '⇄  Switch Account': '⇄  切換帳號',
    'Select Language / 选择语言': '選擇語言',
    'Select Currency / 选择币种': '選擇幣種',
    'Save & Start →': '儲存並開始 →',
    'Next →': '下一步 →',
    '← Back': '← 返回',
    '5-day (dual rest)': '週休二日',
    '5.5-day (alternating)': '隔週休',
    '6-day (single rest)': '週休一日',
    'tap to toggle rest days': '點擊切換休息日',
    'This Saturday:': '本週六：',
    'work': '上班',
    'rest': '休息',
    'Start': '開始',
    'End': '結束',
    'Overtime Rate': '加班費率',
    'Multiplier': '倍率',
    'Base Rate': '基礎費率',
    'Custom': '自訂',
    'currency': '幣種',
    'Mon': '週一', 'Tue': '週二', 'Wed': '週三', 'Thu': '週四',
    'Fri': '週五', 'Sat': '週六', 'Sun': '週日',
    'M': '一', 'T': '二', 'W': '三', 'F': '五', 'S': '六',
  }
};

// ── Helpers ─────────────────────────────────────────────
function getLang(){
  try {
    var v = localStorage.getItem('wageClock_' + (sessionStorage.getItem('wageClock_currentUser')||'') + '_language');
    return v || 'zh-CN';
  } catch(e){ return 'zh-CN'; }
}

// ── Translate a single string ───────────────────────────
function t(text, lang){
  lang = lang || getLang();
  if(lang === 'en') return text; // English = default = HTML text
  var dict = DICT[lang];
  if(!dict) return text;
  // Try exact match first, then trimmed
  var key = text.trim();
  if(dict.hasOwnProperty(key)) return dict[key];
  if(dict.hasOwnProperty(text)) return dict[text];
  return text;
}

// ── Walk text nodes and translate ───────────────────────
function walkTextNodes(root, dict, seen){
  // Skip script/style tags
  if(root.nodeType === 1){
    var tag = root.tagName;
    if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA') return;
  }

  if(root.nodeType === 3){ // Text node
    var text = root.nodeValue;
    var trimmed = text.trim();
    if(trimmed && dict.hasOwnProperty(trimmed)){
      root.nodeValue = text.replace(trimmed, dict[trimmed]);
    }
    return;
  }

  // Recurse into children
  var children = root.childNodes;
  if(children){
    for(var i = 0; i < children.length; i++){
      walkTextNodes(children[i], dict);
    }
  }
}

// ── Apply translations to the DOM ───────────────────────
function applyI18n(root, lang){
  root = root || document;
  lang = lang || getLang();
  if(lang === 'en') return; // nothing to do, HTML is English

  var dict = DICT[lang];
  if(!dict) return;

  // Walk all text nodes for automatic translation
  walkTextNodes(root, dict);

  // Elements with data-i18n attribute — force translate textContent
  var elements = root.querySelectorAll('[data-i18n]');
  for(var i = 0; i < elements.length; i++){
    var el = elements[i];
    var text = (el.textContent || '').trim();
    if(dict.hasOwnProperty(text)){
      el.textContent = dict[text];
    }
  }

  // Input placeholders
  var inputs = root.querySelectorAll('[data-i18n-placeholder]');
  for(var j = 0; j < inputs.length; j++){
    var inp = inputs[j];
    var ph = (inp.placeholder || '').trim();
    if(dict.hasOwnProperty(ph)){
      inp.placeholder = dict[ph];
    }
  }

  // data-i18n-title for title attributes
  var titled = root.querySelectorAll('[data-i18n-title]');
  for(var k = 0; k < titled.length; k++){
    var tel = titled[k];
    var tt = (tel.title || '').trim();
    if(dict.hasOwnProperty(tt)){
      tel.title = dict[tt];
    }
  }
}

// ── Public API ───────────────────────────────────────────
global.initI18n = function(){
  applyI18n(document);
};

// Re-export t() for dynamic strings (JS-set textContent)
global.t = t;
global.getLang = getLang;

// Auto-init when script loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ applyI18n(document); });
} else {
  applyI18n(document);
}

})(window);

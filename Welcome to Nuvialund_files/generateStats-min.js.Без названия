var websiteStatistics = new (function() {var ws = this;var timestamp = '';function stats_input_val_by_id_txt(element_id_txt) {var el = document.getElementById(element_id_txt);return el ? el.value : '';}
this.serializeStatsPayload = function(data_obj) {var parts_arr = [];var key_txt;for (key_txt in data_obj) {if (!Object.prototype.hasOwnProperty.call(data_obj, key_txt)) {continue;}
var val = data_obj[key_txt];if (val === undefined) {continue;}
parts_arr.push(encodeURIComponent(key_txt) + '=' + encodeURIComponent(val === null ? '' : String(val)));}
return parts_arr.join('&');};this.init = function() {ws.data = {};timestamp = +new Date();ws.trackTimeSpentInit();var req = window.location;var path = req.pathname + req.search;if ( !path ) {path = '/';}
var hostname = req.protocol + '//' + req.hostname;
ws.data.id = ws.randomString(20);ws.data.hn = hostname;ws.data.pt = path;ws.data.t = document.title;ws.data.wID = stats_input_val_by_id_txt('websiteID');ws.data.tm = timestamp;ws.data.rf = document.referrer;ws.data.mNUM = '';var stats_module_type_el = document.getElementById('moduleTypeNUM');if ( stats_module_type_el ) {ws.data.mNUM = stats_module_type_el.value;}
ws.data.dv = ws.getUserDevice();ws.data.screenRes = screen.width + 'X' + screen.height;ws.data.utm_source = this.statGetQueryString.utm_source ? this.statGetQueryString.utm_source : '';ws.data.utm_medium = this.statGetQueryString.utm_medium ? this.statGetQueryString.utm_medium : '';ws.data.utm_campaign = this.statGetQueryString.utm_campaign ? this.statGetQueryString.utm_campaign : '';ws.data.utm_term = this.statGetQueryString.utm_term ? this.statGetQueryString.utm_term : '';ws.data.utm_content = this.statGetQueryString.utm_content ? this.statGetQueryString.utm_content : '';var data = ws.getData();ws.data.uq = data.pagesViewed.indexOf(path) == -1 ? 1 : 0;ws.data.nvs = data.isNewVisitor ? 1 : 0;ws.data.ns = data.isNewSession ? 1 : 0;ws.data.pid = data.previousPageviewId || '';ws.data.sid = data.sid;ws.action = 'save';ws.data.cz_uid = stats_input_val_by_id_txt('cz_uid');ws.data.is_free_user = packageNUM && packageNUM == 1 ? 1 : 0;ws.saveStatistics(data, 'save');};this.trackTimeSpentInit = function() {var start = new Date();if ( ws._stats_pjax_send_handler_fun ) {document.removeEventListener('s123.pjax.send', ws._stats_pjax_send_handler_fun);}
ws._stats_pjax_send_handler_fun = function() {ws.trackTimeSpent(start);};document.addEventListener('s123.pjax.send', ws._stats_pjax_send_handler_fun);window.onbeforeunload = function() {ws.trackTimeSpent(start);};};this.trackTimeSpent = function( start ) {var end = new Date();ws.data.time_spent = Math.floor((end.getTime() - start.getTime()) / 1000);ws.data.is_finished = 1;ws.saveStatistics(null, 'update');};this.saveStatistics = function( data, action ) {var url = new URL('https://analytics.loadweb.com/versions/2/wizard/statistics/classes/Router.php');
url.search = 'action=save&' + ws.serializeStatsPayload(ws.data);fetch(url,{method: 'get',keepalive: action === 'update' ? false : true,}).then( (response) => {if ( data ) {let now = new Date();let expiresStats = new Date(now.getTime() + (24 * 60 * 60 * 1000));data.previousPageviewId = ws.data.id;data.isNewVisitor = false;data.isNewSession = false;data.timestamp = timestamp;ws.setCookie('_website_stats', JSON.stringify(data), {expires: expiresStats,path: '/',});}});};this.randomString = function(n) {var s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';return Array(n)
.join()
.split(',')
.map(function() {return s.charAt(Math.floor(Math.random() * s.length));})
.join('');};this.getCookie = function(name) {var cookies = document.cookie ? document.cookie.split('; ') : [];for (var i = 0; i < cookies.length; i++) {var parts = cookies[i].split('=');if ( decodeURIComponent(parts[0]) !== name ) continue;var cookie = parts.slice(1).join('=');return decodeURIComponent(cookie);}
return '';};this.setCookie = function(name, data, args) {name = encodeURIComponent(name);data = encodeURIComponent(String(data));var str = name + '=' + data;if ( args.path ) {str += ';path=' + args.path;}
if ( args.expires ) {str += ';expires=' + args.expires;}
document.cookie = str;};this.newVisitorData = function() {return {isNewVisitor: true,isNewSession: true,pagesViewed: [],previousPageviewId: '',timestamp: timestamp,sid: ws.uniqid('st-')};};this.uniqid = function(prefix, more_entropy) {if (typeof prefix === 'undefined') prefix = '';var retId;var formatSeed = function (seed, reqWidth) {seed = parseInt(seed, 10).toString(16);if (reqWidth < seed.length) {return seed.slice(seed.length - reqWidth);}
if (reqWidth > seed.length) {return Array(1 + (reqWidth - seed.length)).join('0') + seed;}
return seed;};if (!this.php_js) {this.php_js = {};}
if (!this.php_js.uniqidSeed) {this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);}
this.php_js.uniqidSeed++;retId = prefix;retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);retId += formatSeed(this.php_js.uniqidSeed, 5);if (more_entropy) {retId += (Math.random() * 10).toFixed(8).toString();}
return retId;}
this.getData = function() {let thirtyMinsAgo = new Date();thirtyMinsAgo.setMinutes(thirtyMinsAgo.getMinutes() - 30);let data = ws.getCookie('_website_stats');if ( !data ) {data = ws.newVisitorData();}
try {data = JSON.parse(data);} catch (e) {data = ws.newVisitorData();}
if ( data.timestamp < +thirtyMinsAgo ) {data.isNewSession = true;}
return data;};this.getUserDevice = function() {var userAgent = navigator.userAgent;if (userAgent.match(/Android/i)) {return 'Mobile';}
if (userAgent.match(/BlackBerry/i)) {return 'Mobile';}
if (userAgent.match(/iPhone/i)) {return 'Mobile';}
if (userAgent.match(/iPad/i)) {return 'Tablet';}
if (userAgent.match(/iPod/i)) {return 'Mobile';}
if (userAgent.match(/Opera Mini/i)) {return 'Mobile';}
if (userAgent.match(/IEMobile/i)) {return 'Mobile';}
if (userAgent.match(/Macintosh/i)) {return 'Desktop';}
if (userAgent.match(/Windows/i)) {return 'Desktop';}
return 'Unknown Device';};this.statGetQueryString = (function(paramsArray) {let params = {};for (let i = 0; i < paramsArray.length; ++i)
{let param = paramsArray[i]
.split('=', 2);if (param.length !== 2)
continue;params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));}
return params;})(window.location.search.substr(1).split('&'));})();(function stats_bootstrap_fun() {function stats_run_on_dom_ready(callback_fun) {if (document.readyState === 'loading') {document.addEventListener('DOMContentLoaded', callback_fun);} else {callback_fun();}}
function stats_pjax_complete_handler_fun() {websiteStatistics.init();}
stats_run_on_dom_ready(function stats_dom_ready_fun() {websiteStatistics.init();document.addEventListener('s123.pjax.complete', stats_pjax_complete_handler_fun);});})();

ace.define("ace/snippets",["require","exports","module","ace/lib/oop","ace/lib/event_emitter","ace/lib/lang","ace/range","ace/anchor","ace/keyboard/hash_handler","ace/tokenizer","ace/lib/dom","ace/editor"],function(e,r,t){"use strict";function i(){this.snippetMap={},this.snippetNameMap={}}var n=e("./lib/oop"),o=e("./lib/event_emitter").EventEmitter,h=e("./lib/lang"),l=e("./range").Range,s=e("./anchor").Anchor,a=e("./keyboard/hash_handler").HashHandler,c=e("./tokenizer").Tokenizer,p=l.comparePoints;(function(){n.implement(this,o),this.getTokenizer=function(){function n(e,t,i){return e=e.substr(1),/^\d+$/.test(e)&&!i.inFormatString?[{tabstopId:parseInt(e,10)}]:[{text:e}]}function e(e){return"(?:[^\\\\"+e+"]|\\\\.)"}return i.$tokenizer=new c({start:[{regex:/:/,onMatch:function(e,t,i){return i.length&&i[0].expectIf?(i[0].expectIf=!1,i[0].elseBranch=i[0],[i[0]]):":"}},{regex:/\\./,onMatch:function(e,t,i){var n=e[1];return"}"==n&&i.length||-1!="`$\\".indexOf(n)?e=n:i.inFormatString&&("n"==n||"t"==n?e="\n":-1!="ulULE".indexOf(n)&&(e={changeCase:n,local:"a"<n})),[e]}},{regex:/}/,onMatch:function(e,t,i){return[i.length?i.shift():e]}},{regex:/\$(?:\d+|\w+)/,onMatch:n},{regex:/\$\{[\dA-Z_a-z]+/,onMatch:function(e,t,i){e=n(e.substr(1),0,i);return i.unshift(e[0]),e},next:"snippetVar"},{regex:/\n/,token:"newline",merge:!1}],snippetVar:[{regex:"\\|"+e("\\|")+"*\\|",onMatch:function(e,t,i){i[0].choices=e.slice(1,-1).split(",")},next:"start"},{regex:"/("+e("/")+"+)/(?:("+e("/")+"*)/)(\\w*):?",onMatch:function(e,t,i){i=i[0];return i.fmtString=e,e=this.splitRegex.exec(e),i.guard=e[1],i.fmt=e[2],i.flag=e[3],""},next:"start"},{regex:"`"+e("`")+"*`",onMatch:function(e,t,i){return i[0].code=e.splice(1,-1),""},next:"start"},{regex:"\\?",onMatch:function(e,t,i){i[0]&&(i[0].expectIf=!0)},next:"start"},{regex:"([^:}\\\\]|\\\\.)*:?",token:"",next:"start"}],formatString:[{regex:"/("+e("/")+"+)/",token:"regex"},{regex:"",onMatch:function(e,t,i){i.inFormatString=!0},next:"start"}]}),i.prototype.getTokenizer=function(){return i.$tokenizer},i.$tokenizer},this.tokenizeTmSnippet=function(e,t){return this.getTokenizer().getLineTokens(e,t).tokens.map(function(e){return e.value||e})},this.$getDefaultValue=function(e,t){if(/^[A-Z]\d+$/.test(t)){var i=t.substr(1);return(this.variables[t[0]+"__"]||{})[i]}if(/^\d+$/.test(t))return(this.variables.__||{})[t];if(t=t.replace(/^TM_/,""),e){var n=e.session;switch(t){case"CURRENT_WORD":var o=n.getWordRange();case"SELECTION":case"SELECTED_TEXT":return n.getTextRange(o);case"CURRENT_LINE":return n.getLine(e.getCursorPosition().row);case"PREV_LINE":return n.getLine(e.getCursorPosition().row-1);case"LINE_INDEX":return e.getCursorPosition().column;case"LINE_NUMBER":return e.getCursorPosition().row+1;case"SOFT_TABS":return n.getUseSoftTabs()?"YES":"NO";case"TAB_SIZE":return n.getTabSize();case"FILENAME":case"FILEPATH":return"";case"FULLNAME":return"Ace"}}},this.variables={},this.getVariableValue=function(e,t){return this.variables.hasOwnProperty(t)?this.variables[t](e,t)||"":this.$getDefaultValue(e,t)||""},this.tmStrFormat=function(e,t,s){var i=t.flag||"",n=t.guard,n=new RegExp(n,i.replace(/[^gi]/,"")),r=this.tokenizeTmSnippet(t.fmt,"formatString"),a=this,n=e.replace(n,function(){a.variables.__=arguments;for(var e=a.resolveVariables(r,s),t="E",i=0;i<e.length;i++){var n,o=e[i];"object"==typeof o?(e[i]="",o.changeCase&&o.local?(n=e[i+1])&&"string"==typeof n&&("u"==o.changeCase?e[i]=n[0].toUpperCase():e[i]=n[0].toLowerCase(),e[i+1]=n.substr(1)):o.changeCase&&(t=o.changeCase)):"U"==t?e[i]=o.toUpperCase():"L"==t&&(e[i]=o.toLowerCase())}return e.join("")});return this.variables.__=null,n},this.resolveVariables=function(t,e){for(var i=[],n=0;n<t.length;n++){var o,s=t[n];"string"==typeof s?i.push(s):"object"==typeof s&&(s.skip?r(s):s.processed<n||(s.text?((o=this.getVariableValue(e,s.text))&&s.fmtString&&(o=this.tmStrFormat(o,s)),s.processed=n,null==s.expectIf?o&&(i.push(o),r(s)):o?s.skip=s.elseBranch:r(s)):null==s.tabstopId&&null==s.changeCase||i.push(s)))}function r(e){e=t.indexOf(e,n+1);-1!=e&&(n=e)}return i},this.insertSnippetForSelection=function(e,t){var i=e.getCursorPosition(),n=e.session.getLine(i.row),o=e.session.getTabString(),s=n.match(/^\s*/)[0];i.column<s.length&&(s=s.slice(0,i.column)),t=t.replace(/\r/g,"");var r=this.tokenizeTmSnippet(t);r=(r=this.resolveVariables(r,e)).map(function(e){return"\n"==e?e+s:"string"==typeof e?e.replace(/\t/g,o):e});var a=[];r.forEach(function(e,t){var i,n;"object"==typeof e&&(i=e.tabstopId,(n=a[i])||((n=a[i]=[]).index=i,n.value=""),-1===n.indexOf(e)&&(n.push(e),-1!==(e=r.indexOf(e,t+1))&&((e=r.slice(t+1,e)).some(function(e){return"object"==typeof e})&&!n.value?n.value=e:!e.length||n.value&&"string"==typeof n.value||(n.value=e.join("")))))}),a.forEach(function(e){e.length=0});var c={};for(var h=0;h<r.length;h++){var l,p,u,d,g=r[h];"object"==typeof g&&(l=g.tabstopId,p=r.indexOf(g,h+1),c[l]?c[l]===g&&(c[l]=null):((d="string"==typeof(u=a[l]).value?[u.value]:function(e){for(var t=[],i=0;i<e.length;i++){if("object"==typeof(n=e[i])){if(c[n.tabstopId])continue;var n=t[e.lastIndexOf(n,i-1)]||{tabstopId:n.tabstopId}}t[i]=n}return t}(u.value)).unshift(h+1,Math.max(0,p-h)),d.push(g),c[l]=g,r.splice.apply(r,d),-1===u.indexOf(g)&&u.push(g)))}var f=0,m=0,b="";r.forEach(function(e){var t;"string"==typeof e?(1<(t=e.split("\n")).length?(m=t[t.length-1].length,f+=t.length-1):m+=e.length,b+=e):e.start?e.end={row:f,column:m}:e.start={row:f,column:m}});n=e.getSelectionRange(),i=e.session.replace(n,b),t=new v(e),e=e.inVirtualSelectionMode&&e.selection.index;t.addTabstops(a,n.start,i,e)},this.insertSnippet=function(e,t){var i=this;if(e.inVirtualSelectionMode)return i.insertSnippetForSelection(e,t);e.forEachSelection(function(){i.insertSnippetForSelection(e,t)},null,{keepOrder:!0}),e.tabstopManager&&e.tabstopManager.tabNext()},this.$getScope=function(e){var t,i=e.session.$mode.$id||"";return"html"!==(i=i.split("/").pop())&&"php"!==i||("php"!==i||e.session.$mode.inlinePhp||(i="html"),t=e.getCursorPosition(),"object"==typeof(t=e.session.getState(t.row))&&(t=t[0]),t.substring&&("js-"==t.substring(0,3)?i="javascript":"css-"==t.substring(0,4)?i="css":"php-"==t.substring(0,4)&&(i="php"))),i},this.getActiveScopes=function(e){var t=this.$getScope(e),i=[t],e=this.snippetMap;return e[t]&&e[t].includeScopes&&i.push.apply(i,e[t].includeScopes),i.push("_"),i},this.expandWithTab=function(e,t){var i=this,n=e.forEachSelection(function(){return i.expandSnippetForSelection(e,t)},null,{keepOrder:!0});return n&&e.tabstopManager&&e.tabstopManager.tabNext(),n},this.expandSnippetForSelection=function(e,t){var i,n=e.getCursorPosition(),o=e.session.getLine(n.row),s=o.substring(0,n.column),r=o.substr(n.column),a=this.snippetMap;return this.getActiveScopes(e).some(function(e){e=a[e];return e&&(i=this.findMatchingSnippet(e,s,r)),!!i},this),!!i&&(!(!t||!t.dryRun)||(e.session.doc.removeInLine(n.row,n.column-i.replaceBefore.length,n.column+i.replaceAfter.length),this.variables.M__=i.matchBefore,this.variables.T__=i.matchAfter,this.insertSnippetForSelection(e,i.content),!(this.variables.M__=this.variables.T__=null)))},this.findMatchingSnippet=function(e,t,i){for(var n=e.length;n--;){var o=e[n];if((!o.startRe||o.startRe.test(t))&&((!o.endRe||o.endRe.test(i))&&(o.startRe||o.endRe)))return o.matchBefore=o.startRe?o.startRe.exec(t):[""],o.matchAfter=o.endRe?o.endRe.exec(i):[""],o.replaceBefore=o.triggerRe?o.triggerRe.exec(t)[0]:"",o.replaceAfter=o.endTriggerRe?o.endTriggerRe.exec(i)[0]:"",o}},this.snippetMap={},this.snippetNameMap={},this.register=function(e,n){var o=this.snippetMap,s=this.snippetNameMap,r=this;function a(e){return e&&!/^\^?\(.*\)\$?$|^\\b$/.test(e)&&(e="(?:"+e+")"),e||""}function c(e,t,i){return e=a(e),t=a(t),i?(e=t+e)&&"$"!=e[e.length-1]&&(e+="$"):(e+=t)&&"^"!=e[0]&&(e="^"+e),new RegExp(e)}function t(e){e.scope||(e.scope=n||"_"),n=e.scope,o[n]||(o[n]=[],s[n]={});var t,i=s[n];e.name&&((t=i[e.name])&&r.unregister(t),i[e.name]=e),o[n].push(e),e.tabTrigger&&!e.trigger&&(!e.guard&&/^\w/.test(e.tabTrigger)&&(e.guard="\\b"),e.trigger=h.escapeRegExp(e.tabTrigger)),(e.trigger||e.guard||e.endTrigger||e.endGuard)&&(e.startRe=c(e.trigger,e.guard,!0),e.triggerRe=new RegExp(e.trigger,"",!0),e.endRe=c(e.endTrigger,e.endGuard,!0),e.endTriggerRe=new RegExp(e.endTrigger,"",!0))}(e=e||[])&&e.content?t(e):Array.isArray(e)&&e.forEach(t),this._signal("registerSnippets",{scope:n})},this.unregister=function(e,i){var n=this.snippetMap,o=this.snippetNameMap;function t(e){var t=o[e.scope||i];t&&t[e.name]&&(delete t[e.name],0<=(e=(t=n[e.scope||i])&&t.indexOf(e))&&t.splice(e,1))}e.content?t(e):Array.isArray(e)&&e.forEach(t)},this.parseSnippetFile=function(e){e=e.replace(/\r/g,"");for(var t,i,n,o,s=[],r={},a=/^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;t=a.exec(e);){if(t[1])try{r=JSON.parse(t[1]),s.push(r)}catch(e){}t[4]?(r.content=t[4].replace(/^\t/gm,""),s.push(r),r={}):(i=t[2],n=t[3],"regex"==i?(o=/\/((?:[^\/\\]|\\.)*)|$/g,r.guard=o.exec(n)[1],r.trigger=o.exec(n)[1],r.endTrigger=o.exec(n)[1],r.endGuard=o.exec(n)[1]):"snippet"==i?(r.tabTrigger=n.match(/^\S*/)[0],r.name||(r.name=n)):r[i]=n)}return s},this.getSnippetByName=function(t,e){var i,n=this.snippetNameMap;return this.getActiveScopes(e).some(function(e){e=n[e];return e&&(i=e[t]),!!i},this),i}}).call(i.prototype);var v=function(e){if(e.tabstopManager)return e.tabstopManager;(e.tabstopManager=this).$onChange=this.onChange.bind(this),this.$onChangeSelection=h.delayedCall(this.onChangeSelection.bind(this)).schedule,this.$onChangeSession=this.onChangeSession.bind(this),this.$onAfterExec=this.onAfterExec.bind(this),this.attach(e)};(function(){this.attach=function(e){this.index=0,this.ranges=[],this.tabstops=[],this.$openTabstops=null,this.selectedTabstop=null,this.editor=e,this.editor.on("change",this.$onChange),this.editor.on("changeSelection",this.$onChangeSelection),this.editor.on("changeSession",this.$onChangeSession),this.editor.commands.on("afterExec",this.$onAfterExec),this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler)},this.detach=function(){this.tabstops.forEach(this.removeTabstopMarkers,this),this.ranges=null,this.tabstops=null,this.selectedTabstop=null,this.editor.removeListener("change",this.$onChange),this.editor.removeListener("changeSelection",this.$onChangeSelection),this.editor.removeListener("changeSession",this.$onChangeSession),this.editor.commands.removeListener("afterExec",this.$onAfterExec),this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler),this.editor.tabstopManager=null,this.editor=null},this.onChange=function(e){var t="r"==e.action[0],i=e.start,n=e.end,o=i.row,s=n.row-o,r=n.column-i.column;if(t&&(s=-s,r=-r),!this.$inChange&&t){e=this.selectedTabstop;if(e&&!e.some(function(e){return p(e.start,i)<=0&&0<=p(e.end,n)}))return this.detach()}for(var a=this.ranges,c=0;c<a.length;c++){var h=a[c];h.end.row<i.row||(t&&p(i,h.start)<0&&0<p(n,h.end)?(this.removeRange(h),c--):(h.start.row==o&&h.start.column>i.column&&(h.start.column+=r),h.end.row==o&&h.end.column>=i.column&&(h.end.column+=r),h.start.row>=o&&(h.start.row+=s),h.end.row>=o&&(h.end.row+=s),0<p(h.start,h.end)&&this.removeRange(h)))}a.length||this.detach()},this.updateLinkedFields=function(){var e=this.selectedTabstop;if(e&&e.hasLinkedRanges){this.$inChange=!0;for(var t=this.editor.session,i=t.getTextRange(e.firstNonLinked),n=e.length;n--;){var o,s=e[n];s.linked&&(o=r.snippetManager.tmStrFormat(i,s.original),t.replace(s,o))}this.$inChange=!1}},this.onAfterExec=function(e){e.command&&!e.command.readOnly&&this.updateLinkedFields()},this.onChangeSelection=function(){if(this.editor){for(var e=this.editor.selection.lead,t=this.editor.selection.anchor,i=this.editor.selection.isEmpty(),n=this.ranges.length;n--;)if(!this.ranges[n].linked){var o=this.ranges[n].contains(e.row,e.column),s=i||this.ranges[n].contains(t.row,t.column);if(o&&s)return}this.detach()}},this.onChangeSession=function(){this.detach()},this.tabNext=function(e){var t=this.tabstops.length,e=this.index+(e||1);(e=Math.min(Math.max(e,1),t))==t&&(e=0),this.selectTabstop(e),0===e&&this.detach()},this.selectTabstop=function(e){this.$openTabstops=null;var t=this.tabstops[this.index];if(t&&this.addTabstopMarkers(t),this.index=e,(t=this.tabstops[this.index])&&t.length){if(this.selectedTabstop=t,this.editor.inVirtualSelectionMode)this.editor.selection.setRange(t.firstNonLinked);else{var i=this.editor.multiSelect;i.toSingleRange(t.firstNonLinked.clone());for(var n=t.length;n--;)t.hasLinkedRanges&&t[n].linked||i.addRange(t[n].clone(),!0);i.ranges[0]&&i.addRange(i.ranges[0].clone())}this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler)}},this.addTabstops=function(e,r,t){this.$openTabstops||(this.$openTabstops=[]),e[0]||(t=l.fromPoints(t,t),g(t.start,r),g(t.end,r),e[0]=[t],e[0].index=0);var a=[this.index+1,0],c=this.ranges;e.forEach(function(e,t){for(var i=this.$openTabstops[t]||e,n=e.length;n--;){var o=e[n],s=l.fromPoints(o.start,o.end||o.start);d(s.start,r),d(s.end,r),s.original=o,s.tabstop=i,c.push(s),i!=e?i.unshift(s):i[n]=s,o.fmtString?(s.linked=!0,i.hasLinkedRanges=!0):i.firstNonLinked||(i.firstNonLinked=s)}i.firstNonLinked||(i.hasLinkedRanges=!1),i===e&&(a.push(i),this.$openTabstops[t]=i),this.addTabstopMarkers(i)},this),2<a.length&&(this.tabstops.length&&a.push(a.splice(2,1)[0]),this.tabstops.splice.apply(this.tabstops,a))},this.addTabstopMarkers=function(e){var t=this.editor.session;e.forEach(function(e){e.markerId||(e.markerId=t.addMarker(e,"ace_snippet-marker","text"))})},this.removeTabstopMarkers=function(e){var t=this.editor.session;e.forEach(function(e){t.removeMarker(e.markerId),e.markerId=null})},this.removeRange=function(e){var t=e.tabstop.indexOf(e);e.tabstop.splice(t,1),t=this.ranges.indexOf(e),this.ranges.splice(t,1),this.editor.session.removeMarker(e.markerId),e.tabstop.length||(-1!=(t=this.tabstops.indexOf(e.tabstop))&&this.tabstops.splice(t,1),this.tabstops.length||this.detach())},this.keyboardHandler=new a,this.keyboardHandler.bindKeys({Tab:function(e){r.snippetManager&&r.snippetManager.expandWithTab(e)||e.tabstopManager.tabNext(1)},"Shift-Tab":function(e){e.tabstopManager.tabNext(-1)},Esc:function(e){e.tabstopManager.detach()},Return:function(e){return!1}})}).call(v.prototype);var u={};u.onChange=s.prototype.onChange,u.setPosition=function(e,t){this.pos.row=e,this.pos.column=t},u.update=function(e,t,i){this.$insertRight=i,this.pos=e,this.onChange(t)};var d=function(e,t){0==e.row&&(e.column+=t.column),e.row+=t.row},g=function(e,t){e.row==t.row&&(e.column-=t.column),e.row-=t.row};e("./lib/dom").importCssString(".ace_snippet-marker {    -moz-box-sizing: border-box;    box-sizing: border-box;    background: rgba(194, 193, 208, 0.09);    border: 1px dotted rgba(211, 208, 235, 0.62);    position: absolute;}"),r.snippetManager=new i;e=e("./editor").Editor;(function(){this.insertSnippet=function(e,t){return r.snippetManager.insertSnippet(this,e,t)},this.expandSnippet=function(e){return r.snippetManager.expandWithTab(this,e)}}).call(e.prototype)}),ace.define("ace/autocomplete/popup",["require","exports","module","ace/virtual_renderer","ace/editor","ace/range","ace/lib/event","ace/lib/lang","ace/lib/dom"],function(e,t,i){"use strict";function s(e){return(e=new n(e)).$maxLines=4,(e=new o(e)).setHighlightActiveLine(!1),e.setShowPrintMargin(!1),e.renderer.setShowGutter(!1),e.renderer.setHighlightGutterLine(!1),e.$mouseHandler.$focusWaitTimout=0,e.$highlightTagPending=!0,e}var n=e("../virtual_renderer").VirtualRenderer,o=e("../editor").Editor,r=e("../range").Range,a=e("../lib/event"),c=e("../lib/lang"),p=e("../lib/dom");p.importCssString(".ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {    background-color: #CAD6FA;    z-index: 1;}.ace_editor.ace_autocomplete .ace_line-hover {    border: 1px solid #abbffe;    margin-top: -1px;    background: rgba(233,233,253,0.4);}.ace_editor.ace_autocomplete .ace_line-hover {    position: absolute;    z-index: 2;}.ace_editor.ace_autocomplete .ace_scroller {   background: none;   border: none;   box-shadow: none;}.ace_rightAlignedText {    color: gray;    display: inline-block;    position: absolute;    right: 4px;    text-align: right;    z-index: -1;}.ace_editor.ace_autocomplete .ace_completion-highlight{    color: #000;    text-shadow: 0 0 0.01em;}.ace_editor.ace_autocomplete {    width: 280px;    z-index: 200000;    background: #fbfbfb;    color: #444;    border: 1px lightgray solid;    position: fixed;    box-shadow: 2px 3px 5px rgba(0,0,0,.2);    line-height: 1.4;}"),t.AcePopup=function(e){var t=p.createElement("div"),h=new s(t);e&&e.appendChild(t),t.style.display="none",h.renderer.content.style.cursor="default",h.renderer.setStyle("ace_autocomplete"),h.setOption("displayIndentGuides",!1),h.setOption("dragDelay",150);var l,e=function(){};h.focus=e,h.$isFocused=!0,h.renderer.$cursorLayer.restartTimer=e,h.renderer.$cursorLayer.element.style.opacity=0,h.renderer.$maxLines=8,h.renderer.$keepTextAreaAtCursor=!1,h.setHighlightActiveLine(!1),h.session.highlight(""),h.session.$searchHighlight.clazz="ace_highlight-marker",h.on("mousedown",function(e){var t=e.getDocumentPosition();h.selection.moveToPosition(t),n.start.row=n.end.row=t.row,e.stop()});var i=new r(-1,0,-1,1/0),n=new r(-1,0,-1,1/0);n.id=h.session.addMarker(n,"ace_active-line","fullLine"),h.setSelectOnHover=function(e){e?i.id&&(h.session.removeMarker(i.id),i.id=null):i.id=h.session.addMarker(i,"ace_line-hover","fullLine")},h.setSelectOnHover(!1),h.on("mousemove",function(e){var t;l?l.x==e.x&&l.y==e.y||((l=e).scrollTop=h.renderer.scrollTop,t=l.getDocumentPosition().row,i.start.row!=t&&(i.id||h.setRow(t),o(t))):l=e}),h.renderer.on("beforeRender",function(){var e;l&&-1!=i.start.row&&(l.$pos=null,e=l.getDocumentPosition().row,i.id||h.setRow(e),o(e,!0))}),h.renderer.on("afterRender",function(){var e=h.getRow(),t=h.renderer.$textLayer,e=t.element.childNodes[e-t.config.firstRow];e!=t.selectedNode&&(t.selectedNode&&p.removeCssClass(t.selectedNode,"ace_selected"),(t.selectedNode=e)&&p.addCssClass(e,"ace_selected"))});var t=function(){o(-1)},o=function(e,t){e!==i.start.row&&(i.start.row=i.end.row=e,t||h.session._emit("changeBackMarker"),h._emit("changeHoverMarker"))};h.getHoveredRow=function(){return i.start.row},a.addListener(h.container,"mouseout",t),h.on("hide",t),h.on("changeSelection",t),h.session.doc.getLength=function(){return h.data.length},h.session.doc.getLine=function(e){e=h.data[e];return"string"==typeof e?e:e&&e.value||""};t=h.session.bgTokenizer;return t.$tokenizeRow=function(e){var t=h.data[e],i=[];if(!t)return i;"string"==typeof t&&(t={value:t}),t.caption||(t.caption=t.value||t.name);for(var n,o,s,r=-1,a=0;a<t.caption.length;a++)o=t.caption[a],r!==(n=t.matchMask&1<<a?1:0)?(i.push({type:t.className||(n?"completion-highlight":""),value:o}),r=n):i[i.length-1].value+=o;return t.meta&&(s=h.renderer.$size.scrollerWidth/h.renderer.layerConfig.characterWidth,(e=t.meta).length+t.caption.length>s-2&&(e=e.substr(0,s-t.caption.length-3)+"…"),i.push({type:"rightAlignedText",value:e})),i},t.$updateOnChange=e,t.start=e,h.session.$computeWidth=function(){return this.screenWidth=0},h.$blockScrolling=1/0,h.isOpen=!1,h.isTopdown=!1,h.autoSelect=!0,h.data=[],h.setData=function(e){h.setValue(c.stringRepeat("\n",e.length),-1),h.data=e||[],h.setRow(0)},h.getData=function(e){return h.data[e]},h.getRow=function(){return n.start.row},h.setRow=function(e){e=Math.max(this.autoSelect?0:-1,Math.min(this.data.length,e)),n.start.row!=e&&(h.selection.clearSelection(),n.start.row=n.end.row=e||0,h.session._emit("changeBackMarker"),h.moveCursorTo(e||0,0),h.isOpen&&h._signal("select"))},h.on("changeSelection",function(){h.isOpen&&h.setRow(h.selection.lead.row),h.renderer.scrollCursorIntoView()}),h.hide=function(){this.container.style.display="none",this._signal("hide"),h.isOpen=!1},h.show=function(e,t,i){var n=this.container,o=window.innerHeight,s=window.innerWidth,r=this.renderer,a=r.$maxLines*t*1.4,c=e.top+this.$borderSize;o/2<c&&!i&&o<c+t+a?(r.$maxPixelHeight=c-2*this.$borderSize,n.style.top="",n.style.bottom=o-c+"px",h.isTopdown=!1):(c+=t,r.$maxPixelHeight=o-c-.2*t,n.style.top=c+"px",n.style.bottom="",h.isTopdown=!0),n.style.display="",this.renderer.$textLayer.checkForSizeChanges();e=e.left;e+n.offsetWidth>s&&(e=s-n.offsetWidth),n.style.left=e+"px",this._signal("show"),l=null,h.isOpen=!0},h.getTextLeftOffset=function(){return this.$borderSize+this.renderer.$padding+this.$imageSize},h.$imageSize=0,h.$borderSize=1,h}}),ace.define("ace/autocomplete/util",["require","exports","module"],function(e,t,i){"use strict";t.parForEach=function(e,t,i){var n=0,o=e.length;0===o&&i();for(var s=0;s<o;s++)t(e[s],function(e,t){++n===o&&i(e,t)})};var s=/[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;t.retrievePrecedingIdentifier=function(e,t,i){i=i||s;for(var n=[],o=t-1;0<=o&&i.test(e[o]);o--)n.push(e[o]);return n.reverse().join("")},t.retrieveFollowingIdentifier=function(e,t,i){i=i||s;for(var n=[],o=t;o<e.length&&i.test(e[o]);o++)n.push(e[o]);return n},t.getCompletionPrefix=function(e){var t,i=e.getCursorPosition(),n=e.session.getLine(i.row);return e.completers.forEach(function(e){e.identifierRegexps&&e.identifierRegexps.forEach(function(e){!t&&e&&(t=this.retrievePrecedingIdentifier(n,i.column,e))}.bind(this))}.bind(this)),t||this.retrievePrecedingIdentifier(n,i.column)}}),ace.define("ace/autocomplete",["require","exports","module","ace/keyboard/hash_handler","ace/autocomplete/popup","ace/autocomplete/util","ace/lib/event","ace/lib/lang","ace/lib/dom","ace/snippets"],function(e,t,i){"use strict";function n(){this.autoInsert=!1,this.autoSelect=!0,this.exactMatch=!1,this.gatherCompletionsId=0,this.keyboardHandler=new o,this.keyboardHandler.bindKeys(this.commands),this.blurListener=this.blurListener.bind(this),this.changeListener=this.changeListener.bind(this),this.mousedownListener=this.mousedownListener.bind(this),this.mousewheelListener=this.mousewheelListener.bind(this),this.changeTimer=r.delayedCall(function(){this.updateCompletions(!0)}.bind(this)),this.tooltipTimer=r.delayedCall(this.updateDocTooltip.bind(this),50)}var o=e("./keyboard/hash_handler").HashHandler,s=e("./autocomplete/popup").AcePopup,h=e("./autocomplete/util"),r=(e("./lib/event"),e("./lib/lang")),a=e("./lib/dom"),c=e("./snippets").snippetManager;(function(){this.$init=function(){return this.popup=new s(document.body||document.documentElement),this.popup.on("click",function(e){this.insertMatch(),e.stop()}.bind(this)),this.popup.focus=this.editor.focus.bind(this.editor),this.popup.on("show",this.tooltipTimer.bind(null,null)),this.popup.on("select",this.tooltipTimer.bind(null,null)),this.popup.on("changeHoverMarker",this.tooltipTimer.bind(null,null)),this.popup},this.getPopup=function(){return this.popup||this.$init()},this.openPopup=function(e,t,i){this.popup||this.$init(),this.popup.autoSelect=this.autoSelect,this.popup.setData(this.completions.filtered),e.keyBinding.addKeyboardHandler(this.keyboardHandler);var n,o=e.renderer;this.popup.setRow(this.autoSelect?0:-1),i?i&&!t&&this.detach():(this.popup.setTheme(e.getTheme()),this.popup.setFontSize(e.getFontSize()),n=o.layerConfig.lineHeight,(i=o.$cursorLayer.getPixelPosition(this.base,!0)).left-=this.popup.getTextLeftOffset(),t=e.container.getBoundingClientRect(),i.top+=t.top-o.layerConfig.offset,i.left+=t.left-e.renderer.scrollLeft,i.left+=o.gutterWidth,this.popup.show(i,n))},this.detach=function(){this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler),this.editor.off("changeSelection",this.changeListener),this.editor.off("blur",this.blurListener),this.editor.off("mousedown",this.mousedownListener),this.editor.off("mousewheel",this.mousewheelListener),this.changeTimer.cancel(),this.hideDocTooltip(),this.gatherCompletionsId+=1,this.popup&&this.popup.isOpen&&this.popup.hide(),this.base&&this.base.detach(),this.activated=!1,this.completions=this.base=null},this.changeListener=function(e){var t=this.editor.selection.lead;(t.row!=this.base.row||t.column<this.base.column)&&this.detach(),this.activated?this.changeTimer.schedule():this.detach()},this.blurListener=function(e){var t=document.activeElement,i=this.editor.textInput.getElement(),n=e.relatedTarget&&this.tooltipNode&&this.tooltipNode.contains(e.relatedTarget),o=this.popup&&this.popup.container;t==i||t.parentNode==o||n||t==this.tooltipNode||e.relatedTarget==i||this.detach()},this.mousedownListener=function(e){this.detach()},this.mousewheelListener=function(e){this.detach()},this.goTo=function(e){var t=this.popup.getRow(),i=this.popup.session.getLength()-1;switch(e){case"up":t=t<=0?i:t-1;break;case"down":t=i<=t?-1:t+1;break;case"start":t=0;break;case"end":t=i}this.popup.setRow(t)},this.insertMatch=function(e,t){if(!(e=e||this.popup.getData(this.popup.getRow())))return!1;if(e.completer&&e.completer.insertMatch)e.completer.insertMatch(this.editor,e);else{if(this.completions.filterText)for(var i,n=this.editor.selection.getAllRanges(),o=0;i=n[o];o++)i.start.column-=this.completions.filterText.length,this.editor.session.remove(i);e.snippet?c.insertSnippet(this.editor,e.snippet):this.editor.execCommand("insertstring",e.value||e)}this.detach()},this.commands={Up:function(e){e.completer.goTo("up")},Down:function(e){e.completer.goTo("down")},"Ctrl-Up|Ctrl-Home":function(e){e.completer.goTo("start")},"Ctrl-Down|Ctrl-End":function(e){e.completer.goTo("end")},Esc:function(e){e.completer.detach()},Return:function(e){return e.completer.insertMatch()},"Shift-Return":function(e){e.completer.insertMatch(null,{deleteSuffix:!0})},Tab:function(e){var t=e.completer.insertMatch();if(t||e.tabstopManager)return t;e.completer.goTo("down")},PageUp:function(e){e.completer.popup.gotoPageUp()},PageDown:function(e){e.completer.popup.gotoPageDown()}},this.gatherCompletions=function(i,n){var o=i.getSession(),s=i.getCursorPosition(),r=h.getCompletionPrefix(i);this.base=o.doc.createAnchor(s.row,s.column-r.length),this.base.$insertRight=!0;var a=[],c=i.completers.length;return i.completers.forEach(function(e,t){e.getCompletions(i,o,s,r,function(e,t){!e&&t&&(a=a.concat(t)),n(null,{prefix:h.getCompletionPrefix(i),matches:a,finished:0==--c})})}),!0},this.showPopup=function(e){this.editor&&this.detach(),this.activated=!0,(this.editor=e).completer!=this&&(e.completer&&e.completer.detach(),e.completer=this),e.on("changeSelection",this.changeListener),e.on("blur",this.blurListener),e.on("mousedown",this.mousedownListener),e.on("mousewheel",this.mousewheelListener),this.updateCompletions()},this.updateCompletions=function(s){if(s&&this.base&&this.completions){var e=this.editor.getCursorPosition(),e=this.editor.session.getTextRange({start:this.base,end:e});return e==this.completions.filterText?void 0:(this.completions.setFilter(e),this.completions.filtered.length&&(1!=this.completions.filtered.length||this.completions.filtered[0].value!=e||this.completions.filtered[0].snippet)?void this.openPopup(this.editor,e,s):this.detach())}var r=this.gatherCompletionsId;this.gatherCompletions(this.editor,function(e,t){var i=function(){if(t.finished)return this.detach()}.bind(this),n=t.prefix,o=t&&t.matches;if(!o||!o.length)return i();if(0===n.indexOf(t.prefix)&&r==this.gatherCompletionsId){this.completions=new l(o),this.exactMatch&&(this.completions.exactMatch=!0),this.completions.setFilter(n);o=this.completions.filtered;return o.length&&(1!=o.length||o[0].value!=n||o[0].snippet)?this.autoInsert&&1==o.length&&t.finished?this.insertMatch(o[0]):void this.openPopup(this.editor,n,s):i()}}.bind(this))},this.cancelContextMenu=function(){this.editor.$mouseHandler.cancelContextMenu()},this.updateDocTooltip=function(){var e=this.popup,t=e.data,i=t&&(t[e.getHoveredRow()]||t[e.getRow()]),n=null;return i&&this.editor&&this.popup.isOpen?(this.editor.completers.some(function(e){return e.getDocTooltip&&(n=e.getDocTooltip(i)),n}),"string"==typeof(n=n||i)&&(n={docText:n}),n&&(n.docHTML||n.docText)?void this.showDocTooltip(n):this.hideDocTooltip()):this.hideDocTooltip()},this.showDocTooltip=function(e){this.tooltipNode||(this.tooltipNode=a.createElement("div"),this.tooltipNode.className="ace_tooltip ace_doc-tooltip",this.tooltipNode.style.margin=0,this.tooltipNode.style.pointerEvents="auto",this.tooltipNode.tabIndex=-1,this.tooltipNode.onblur=this.blurListener.bind(this),this.tooltipNode.onclick=this.onTooltipClick.bind(this));var t=this.tooltipNode;e.docHTML?t.innerHTML=e.docHTML:e.docText&&(t.textContent=e.docText),t.parentNode||document.body.appendChild(t);var i=this.popup,e=i.container.getBoundingClientRect();t.style.top=i.container.style.top,t.style.bottom=i.container.style.bottom,window.innerWidth-e.right<320?(t.style.right=window.innerWidth-e.left+"px",t.style.left=""):(t.style.left=e.right+1+"px",t.style.right=""),t.style.display="block"},this.hideDocTooltip=function(){var e;this.tooltipTimer.cancel(),this.tooltipNode&&(e=this.tooltipNode,this.editor.isFocused()||document.activeElement!=e||this.editor.focus(),this.tooltipNode=null,e.parentNode&&e.parentNode.removeChild(e))},this.onTooltipClick=function(e){for(var t=e.target;t&&t!=this.tooltipNode;){if("A"==t.nodeName&&t.href){t.rel="noreferrer",t.target="_blank";break}t=t.parentNode}}}).call(n.prototype),n.startCommand={name:"startAutocomplete",exec:function(e){e.completer||(e.completer=new n),e.completer.autoInsert=!1,e.completer.autoSelect=!0,e.completer.showPopup(e),e.completer.cancelContextMenu()},bindKey:"Ctrl-Space|Ctrl-Shift-Space|Alt-Space"};var l=function(e,t){this.all=e,this.filtered=e,this.filterText=t||"",this.exactMatch=!1};(function(){this.setFilter=function(e){var t;t=e.length>this.filterText&&0===e.lastIndexOf(this.filterText,0)?this.filtered:this.all,this.filterText=e,t=(t=this.filterCompletions(t,this.filterText)).sort(function(e,t){return t.exactMatch-e.exactMatch||t.score-e.score});var i=null;t=t.filter(function(e){e=e.snippet||e.caption||e.value;return e!==i&&(i=e,!0)}),this.filtered=t},this.filterCompletions=function(e,t){var i=[],n=t.toUpperCase(),o=t.toLowerCase();e:for(var s,r=0;s=e[r];r++){var a=s.value||s.caption||s.snippet;if(a){var c=-1,h=0,l=0;if(this.exactMatch){if(t!==a.substr(0,t.length))continue e}else for(var p=0;p<t.length;p++){var u=a.indexOf(o[p],c+1),d=a.indexOf(n[p],c+1);if((u=0<=u&&(d<0||u<d)?u:d)<0)continue e;0<(d=u-c-1)&&(-1===c&&(l+=10),l+=d),h|=1<<u,c=u}s.matchMask=h,s.exactMatch=l?0:1,s.score=(s.score||0)-l,i.push(s)}}return i}}).call(l.prototype),t.Autocomplete=n,t.FilteredList=l}),ace.define("ace/autocomplete/text_completer",["require","exports","module","ace/range"],function(e,t,i){var r=e("../range").Range,a=/[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;function c(e,t){var i=(t=t,e.getTextRange(r.fromPoints({row:0,column:0},t)).split(a).length-1),n=e.getValue().split(a),o=Object.create(null),s=n[i];return n.forEach(function(e,t){e&&e!==s&&(t=Math.abs(i-t),t=n.length-t,o[e]?o[e]=Math.max(t,o[e]):o[e]=t)}),o}t.getCompletions=function(e,t,i,n,o){var s=c(t,i);o(null,Object.keys(s).map(function(e){return{caption:e,value:e,score:s[e],meta:"local"}}))}}),ace.define("ace/ext/language_tools",["require","exports","module","ace/snippets","ace/autocomplete","ace/config","ace/lib/lang","ace/autocomplete/util","ace/autocomplete/text_completer","ace/editor","ace/config"],function(e,t,i){"use strict";var a=e("../snippets").snippetManager,n=e("../autocomplete").Autocomplete,o=e("../config"),s=e("../lib/lang"),r=e("../autocomplete/util"),c=e("../autocomplete/text_completer"),h={getCompletions:function(e,t,i,n,o){if(t.$mode.completer)return t.$mode.completer.getCompletions(e,t,i,n,o);e=e.session.getState(i.row);o(null,t.$mode.getCompletions(e,t,i,n))}},l={getCompletions:function(e,t,i,n,o){var s=a.snippetMap,r=[];a.getActiveScopes(e).forEach(function(e){for(var t=s[e]||[],i=t.length;i--;){var n=t[i],o=n.name||n.tabTrigger;o&&r.push({caption:o,snippet:n.content,meta:n.tabTrigger&&!n.name?n.tabTrigger+"⇥ ":"snippet",type:"snippet"})}},this),o(null,r)},getDocTooltip:function(e){"snippet"!=e.type||e.docHTML||(e.docHTML=["<b>",s.escapeHTML(e.caption),"</b>","<hr></hr>",s.escapeHTML(e.snippet)].join(""))}},p=[l,c,h];t.setCompleters=function(e){p.length=0,e&&p.push.apply(p,e)},t.addCompleter=function(e){p.push(e)},t.textCompleter=c,t.keyWordCompleter=h,t.snippetCompleter=l;function u(e,t){f(t.session.$mode)}function d(e){var t=e.editor,i=t.completer&&t.completer.activated;"backspace"===e.command.name?i&&!r.getCompletionPrefix(t)&&t.completer.detach():"insertstring"===e.command.name&&r.getCompletionPrefix(t)&&!i&&(t.completer||(t.completer=new n),t.completer.autoInsert=!1,t.completer.showPopup(t))}var g={name:"expandSnippet",exec:function(e){return a.expandWithTab(e)},bindKey:"Tab"},f=function(e){var t=e.$id;a.files||(a.files={}),m(t),e.modes&&e.modes.forEach(f)},m=function(t){var e;t&&!a.files[t]&&(e=t.replace("mode","snippets"),a.files[t]={},o.loadModule(e,function(e){e&&(!(a.files[t]=e).snippets&&e.snippetText&&(e.snippets=a.parseSnippetFile(e.snippetText)),a.register(e.snippets||[],e.scope),e.includeScopes&&(a.snippetMap[e.scope].includeScopes=e.includeScopes,e.includeScopes.forEach(function(e){m("ace/mode/"+e)})))}))},l=e("../editor").Editor;e("../config").defineOptions(l.prototype,"editor",{enableBasicAutocompletion:{set:function(e){e?(this.completers||(this.completers=Array.isArray(e)?e:p),this.commands.addCommand(n.startCommand)):this.commands.removeCommand(n.startCommand)},value:!1},enableLiveAutocompletion:{set:function(e){e?(this.completers||(this.completers=Array.isArray(e)?e:p),this.commands.on("afterExec",d)):this.commands.removeListener("afterExec",d)},value:!1},enableSnippets:{set:function(e){e?(this.commands.addCommand(g),this.on("changeMode",u),u(0,this)):(this.commands.removeCommand(g),this.off("changeMode",u))},value:!1}})}),ace.require(["ace/ext/language_tools"],function(){});
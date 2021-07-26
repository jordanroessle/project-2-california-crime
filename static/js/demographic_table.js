RegExp.escape=function(r){return r.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")},function(){"use strict";var r;(r="undefined"!=typeof jQuery&&jQuery?jQuery:{}).csv={defaults:{separator:",",delimiter:'"',headers:!0},hooks:{castToScalar:function(r,e){if(isNaN(r))return r;if(/\./.test(r))return parseFloat(r);var a=parseInt(r);return isNaN(a)?null:a}},parsers:{parse:function(r,e){var a=e.separator,t=e.delimiter;e.state.rowNum||(e.state.rowNum=1),e.state.colNum||(e.state.colNum=1);var s=[],o=[],n=0,i="",l=!1;function c(){if(n=0,i="",e.start&&e.state.rowNum<e.start)return o=[],e.state.rowNum++,void(e.state.colNum=1);if(void 0===e.onParseEntry)s.push(o);else{var r=e.onParseEntry(o,e.state);!1!==r&&s.push(r)}o=[],e.end&&e.state.rowNum>=e.end&&(l=!0),e.state.rowNum++,e.state.colNum=1}function u(){if(void 0===e.onParseValue)o.push(i);else{var r=e.onParseValue(i,e.state);!1!==r&&o.push(r)}i="",n=0,e.state.colNum++}var f=RegExp.escape(a),d=RegExp.escape(t),m=/(D|S|\r\n|\n|\r|[^DS\r\n]+)/,p=m.source;return p=(p=p.replace(/S/g,f)).replace(/D/g,d),m=new RegExp(p,"gm"),r.replace(m,function(r){if(!l)switch(n){case 0:if(r===a){i+="",u();break}if(r===t){n=1;break}if(/^(\r\n|\n|\r)$/.test(r)){u(),c();break}i+=r,n=3;break;case 1:if(r===t){n=2;break}i+=r,n=1;break;case 2:if(r===t){i+=r,n=1;break}if(r===a){u();break}if(/^(\r\n|\n|\r)$/.test(r)){u(),c();break}throw new Error("CSVDataError: Illegal State [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");case 3:if(r===a){u();break}if(/^(\r\n|\n|\r)$/.test(r)){u(),c();break}if(r===t)throw new Error("CSVDataError: Illegal Quote [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");throw new Error("CSVDataError: Illegal Data [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");default:throw new Error("CSVDataError: Unknown State [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]")}}),0!==o.length&&(u(),c()),s},splitLines:function(e,a){if(e){var t=(a=a||{}).separator||r.csv.defaults.separator,s=a.delimiter||r.csv.defaults.delimiter;a.state=a.state||{},a.state.rowNum||(a.state.rowNum=1);var o=[],n=0,i="",l=!1,c=RegExp.escape(t),u=RegExp.escape(s),f=/(D|S|\n|\r|[^DS\r\n]+)/,d=f.source;return d=(d=d.replace(/S/g,c)).replace(/D/g,u),f=new RegExp(d,"gm"),e.replace(f,function(r){if(!l)switch(n){case 0:if(r===t){i+=r,n=0;break}if(r===s){i+=r,n=1;break}if("\n"===r){m();break}if(/^\r$/.test(r))break;i+=r,n=3;break;case 1:if(r===s){i+=r,n=2;break}i+=r,n=1;break;case 2:var e=i.substr(i.length-1);if(r===s&&e===s){i+=r,n=1;break}if(r===t){i+=r,n=0;break}if("\n"===r){m();break}if("\r"===r)break;throw new Error("CSVDataError: Illegal state [Row:"+a.state.rowNum+"]");case 3:if(r===t){i+=r,n=0;break}if("\n"===r){m();break}if("\r"===r)break;if(r===s)throw new Error("CSVDataError: Illegal quote [Row:"+a.state.rowNum+"]");throw new Error("CSVDataError: Illegal state [Row:"+a.state.rowNum+"]");default:throw new Error("CSVDataError: Unknown state [Row:"+a.state.rowNum+"]")}}),""!==i&&m(),o}function m(){if(n=0,a.start&&a.state.rowNum<a.start)return i="",void a.state.rowNum++;if(void 0===a.onParseEntry)o.push(i);else{var r=a.onParseEntry(i,a.state);!1!==r&&o.push(r)}i="",a.end&&a.state.rowNum>=a.end&&(l=!0),a.state.rowNum++}},parseEntry:function(r,e){var a=e.separator,t=e.delimiter;e.state.rowNum||(e.state.rowNum=1),e.state.colNum||(e.state.colNum=1);var s=[],o=0,n="";function i(){if(void 0===e.onParseValue)s.push(n);else{var r=e.onParseValue(n,e.state);!1!==r&&s.push(r)}n="",o=0,e.state.colNum++}if(!e.match){var l=RegExp.escape(a),c=RegExp.escape(t),u=/(D|S|\n|\r|[^DS\r\n]+)/.source;u=(u=u.replace(/S/g,l)).replace(/D/g,c),e.match=new RegExp(u,"gm")}return r.replace(e.match,function(r){switch(o){case 0:if(r===a){n+="",i();break}if(r===t){o=1;break}if("\n"===r||"\r"===r)break;n+=r,o=3;break;case 1:if(r===t){o=2;break}n+=r,o=1;break;case 2:if(r===t){n+=r,o=1;break}if(r===a){i();break}if("\n"===r||"\r"===r)break;throw new Error("CSVDataError: Illegal State [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");case 3:if(r===a){i();break}if("\n"===r||"\r"===r)break;if(r===t)throw new Error("CSVDataError: Illegal Quote [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");throw new Error("CSVDataError: Illegal Data [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]");default:throw new Error("CSVDataError: Unknown State [Row:"+e.state.rowNum+"][Col:"+e.state.colNum+"]")}}),i(),s}},helpers:{collectPropertyNames:function(r){var e=[],a=[],t=[];for(e in r)for(a in r[e])r[e].hasOwnProperty(a)&&t.indexOf(a)<0&&"function"!=typeof r[e][a]&&t.push(a);return t}},toArray:function(e,a,t){a=void 0!==a?a:{};var s={};s.callback=void 0!==t&&"function"==typeof t&&t,s.separator="separator"in a?a.separator:r.csv.defaults.separator,s.delimiter="delimiter"in a?a.delimiter:r.csv.defaults.delimiter;var o=void 0!==a.state?a.state:{};a={delimiter:s.delimiter,separator:s.separator,onParseEntry:a.onParseEntry,onParseValue:a.onParseValue,state:o};var n=r.csv.parsers.parseEntry(e,a);if(!s.callback)return n;s.callback("",n)},toArrays:function(e,a,t){a=void 0!==a?a:{};var s={};s.callback=void 0!==t&&"function"==typeof t&&t,s.separator="separator"in a?a.separator:r.csv.defaults.separator,s.delimiter="delimiter"in a?a.delimiter:r.csv.defaults.delimiter;var o;if(void 0!==(a={delimiter:s.delimiter,separator:s.separator,onPreParse:a.onPreParse,onParseEntry:a.onParseEntry,onParseValue:a.onParseValue,onPostParse:a.onPostParse,start:a.start,end:a.end,state:{rowNum:1,colNum:1}}).onPreParse&&a.onPreParse(e,a.state),o=r.csv.parsers.parse(e,a),void 0!==a.onPostParse&&a.onPostParse(o,a.state),!s.callback)return o;s.callback("",o)},toObjects:function(e,a,t){a=void 0!==a?a:{};var s={};s.callback=void 0!==t&&"function"==typeof t&&t,s.separator="separator"in a?a.separator:r.csv.defaults.separator,s.delimiter="delimiter"in a?a.delimiter:r.csv.defaults.delimiter,s.headers="headers"in a?a.headers:r.csv.defaults.headers,a.start="start"in a?a.start:1,s.headers&&a.start++,a.end&&s.headers&&a.end++;var o,n=[];a={delimiter:s.delimiter,separator:s.separator,onPreParse:a.onPreParse,onParseEntry:a.onParseEntry,onParseValue:a.onParseValue,onPostParse:a.onPostParse,start:a.start,end:a.end,state:{rowNum:1,colNum:1},match:!1,transform:a.transform};var i={delimiter:s.delimiter,separator:s.separator,start:1,end:1,state:{rowNum:1,colNum:1}};void 0!==a.onPreParse&&a.onPreParse(e,a.state);var l=r.csv.parsers.splitLines(e,i),c=r.csv.toArray(l[0],a);o=r.csv.parsers.splitLines(e,a),a.state.colNum=1,a.state.rowNum=c?2:1;for(var u=0,f=o.length;u<f;u++){for(var d=r.csv.toArray(o[u],a),m={},p=0;p<c.length;p++)m[c[p]]=d[p];void 0!==a.transform?n.push(a.transform.call(void 0,m)):n.push(m),a.state.rowNum++}if(void 0!==a.onPostParse&&a.onPostParse(n,a.state),!s.callback)return n;s.callback("",n)},fromArrays:function(e,a,t){a=void 0!==a?a:{};var s={};s.callback=void 0!==t&&"function"==typeof t&&t,s.separator="separator"in a?a.separator:r.csv.defaults.separator,s.delimiter="delimiter"in a?a.delimiter:r.csv.defaults.delimiter;var o,n,i,l,c="";for(i=0;i<e.length;i++){for(o=e[i],n=[],l=0;l<o.length;l++){var u=void 0===o[l]||null===o[l]?"":o[l].toString();u.indexOf(s.delimiter)>-1&&(u=u.replace(new RegExp(s.delimiter,"g"),s.delimiter+s.delimiter));var f="\n|\r|S|D";f=(f=f.replace("S",s.separator)).replace("D",s.delimiter),u.search(f)>-1&&(u=s.delimiter+u+s.delimiter),n.push(u)}c+=n.join(s.separator)+"\r\n"}if(!s.callback)return c;s.callback("",c)},fromObjects:function(e,a,t){a=void 0!==a?a:{};var s={};if(s.callback=void 0!==t&&"function"==typeof t&&t,s.separator="separator"in a?a.separator:r.csv.defaults.separator,s.delimiter="delimiter"in a?a.delimiter:r.csv.defaults.delimiter,s.headers="headers"in a?a.headers:r.csv.defaults.headers,s.sortOrder="sortOrder"in a?a.sortOrder:"declare",s.manualOrder="manualOrder"in a?a.manualOrder:[],s.transform=a.transform,"string"==typeof s.manualOrder&&(s.manualOrder=r.csv.toArray(s.manualOrder,s)),void 0!==s.transform){var o,n=e;for(e=[],o=0;o<n.length;o++)e.push(s.transform.call(void 0,n[o]))}var i=r.csv.helpers.collectPropertyNames(e);if("alpha"===s.sortOrder&&i.sort(),s.manualOrder.length>0){var l=[].concat(s.manualOrder);for(u=0;u<i.length;u++)l.indexOf(i[u])<0&&l.push(i[u]);i=l}var c,u,f,d,m=[];for(s.headers&&m.push(i),c=0;c<e.length;c++){for(f=[],u=0;u<i.length;u++)(d=i[u])in e[c]&&"function"!=typeof e[c][d]?f.push(e[c][d]):f.push("");m.push(f)}return r.csv.fromArrays(m,a,s.callback)}},r.csvEntry2Array=r.csv.toArray,r.csv2Array=r.csv.toArrays,r.csv2Dictionary=r.csv.toObjects,"undefined"!=typeof module&&module.exports&&(module.exports=r.csv)}.call(this);

var DemographicTable = DemographicTable || {};

DemographicTable = {
    init: function (options) {
        options = options || {};
        var csv_path = options.csv_path || "";
        var el = options.element || "table-container";
        var allow_download = options.allow_download || false;
        var csv_options = options.csv_options || {};
        var datatables_options = options.datatables_options || {};
        var custom_formatting = options.custom_formatting || [];
        var customTemplates = {};
        $.each(custom_formatting, function (i, v) {
            var colIdx = v[0];
            var func = v[1];
            customTemplates[colIdx] = func;
        });

        var $table = $("<table class='table table-striped table-hoverstriped' id='" + el + "-table'></table>");
        var $containerElement = $("#" + el);
        $containerElement.empty().append($table);

        $.when($.get(csv_path)).then(
            function (data) {
                var csvData = $.csv.toArrays(data, csv_options);
                var $tableHead = $("<thead></thead>");
                var csvHeaderRow = csvData[0];
                var $tableHeadRow = $("<tr></tr>");
                for (var headerIdx = 0; headerIdx < csvHeaderRow.length; headerIdx++) {
                    $tableHeadRow.append($("<th></th>").text(csvHeaderRow[headerIdx]));
                }
                $tableHead.append($tableHeadRow);

                $table.append($tableHead);
                var $tableBody = $("<tbody></tbody>");

                for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                    var $tableBodyRow = $("<tr></tr>");
                    for (var colIdx = 0; colIdx < csvData[rowIdx].length; colIdx++) {
                        var $tableBodyRowTd = $("<td></td>");
                        var cellTemplateFunc = customTemplates[colIdx];
                        if (cellTemplateFunc) {
                            $tableBodyRowTd.html(cellTemplateFunc(csvData[rowIdx][colIdx]));
                        } else {
                            $tableBodyRowTd.text(csvData[rowIdx][colIdx]);
                        }
                        $tableBodyRow.append($tableBodyRowTd);
                        $tableBody.append($tableBodyRow);
                    }
                }
                $table.append($tableBody);

                $table.DataTable(datatables_options);

                if (allow_download) {
                    $containerElement.append("<p><a class='btn btn-dark' href='" + csv_path + "'><i class='glyphicon glyphicon-download'></i> Download as CSV</a></p>");
                }
            });
    }
};

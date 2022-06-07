/* ----------------------------------------------------------------------------------
 *   _      (̅_) _  |‾| gui text editor    (c) Sevarian  2022.04.30   v00.00.01
 *  | |_ ___ _ | |_| |__  ___ ____            aka. Ian Jukes <spayz@realgamer.org>
 * (   _) _ | (   _)  _ \(__ |  _ \       This work is free. You can redistribute it
 *  | |_| __| || |_| | | / _ | | | |      and/or modify itunder the terms of the 
 *   \__)___)_| \__)_| |_\___|_| |_|      GPL v2 (or later versions),
 *                                        https://www.gnu.org/licenses/gpl-2.0.txt
 *                                        for more info see http://amazer.uk/projects
 * -----------------------------------------------------------------------------------
 * compresssion functions from lz-string.js (c)2013 Pieroxy <pieroxy@pieroxy.net>
 * under the WTFPL, Version 2 see http://www.wtfpl.net/
 * http://pieroxy.net/blog/pages/lz-string/testing.html
 * ----------------------------------------------------------------------------------- */
function GUITeithan()
{ this.version='0.0.1';
  this.date='2022-04-30';  
  let _t = this;
  this.log = console.log;
  //this.log = ()=>{}; //production
  this.f = String.fromCharCode;
  this.alloptions='';
  // compresssion functions from lz-string.js (c)2013 Pieroxy <pieroxy@pieroxy.net>
  this.keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  this.keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  this.baseReverseDic = {};
  this.settings=[];

  this.init=() =>
  { $('document').ready(function()
    { _t.refresh();
      setTimeout(function()
      { _t.refresh();
      },5000);
      $('body').on('input','div[teithaneditable]', _t.change);
      $('body').on('input','textarea[teithan]', _t.tachange);
      $('body').on('keyup click','div[teithaneditable]', _t.editevent);
      $('body').on('click','span[teithanmenu] span', _t.menuclick);
    });
  };
  this.refresh=() =>
  { var alloptions=' ';
    $('textarea[teithan]').each(function()
    { alloptions += $(this).data('options')+' ' ;
    });
    _t.alloptions=alloptions;
    if(!_t.alloptions.includes(' no-css ') && $('style[teithan]').length==0)
    { $('body').prepend(`<style type='text/css' teithan>
          [teithaneditable]{border:2px solid black;border-radius:1em;padding:0.5em;overflow:auto;position:relative;z-index:20;}
          [teithanheader]{}
          [teithanmenu]{border:2px solid silver;border-radius:0.5em;background:white;float:right;z-index:2;}
          [teithanmenu] span{font-family:serif;cursor:default;margin:2px 0px 2px 0.25em;border:1px solid silver;border-radius:0.3em;padding:2px 4px;background-color:lightgray;color:black;min-width:1.25em;display:inline-block;text-align:center;}
          [teithanmenu] span.btnoff{background-color:#eee;}
          [teithanmenu] span.btnon{background-color:lime;}
          [teithanmenu] span:hover{background-color:darkgray;color:white;}
          </style>`);
    }

    $('textarea[teithan]').each(function(idx)
    { _t.log( idx + ": " + $(this).text() );
      var tid=$(this).attr('teithan');
      _t.log('tid',tid);
      if(tid=='') //(typeof fr === 'undefined') or
      { var tid=_t.randomString(24);
        $(this).attr('teithan', tid);
        var options=' '+$(this).data('options').toLowerCase()+' ';
        _t.log('options', options);
        if(!options.includes(' show-raw '))
        { $(this).css('display', 'none');
        }
        var mcss=$(this).data('menu-style');
        var lcss=$(this).data('label-style');
        var css=$(this).data('style');
        var label=$(this).data('label');
        var btns='';
        if(options.includes(' std '))
        { options+=' h1 h2 h3 b i u ul ol ';
        } else if(options.includes(' min '))
        { options+=' h1 b i u ';
        }
        _t.log('btn options', options);
        btns= (options.includes(' h1 ') ? `<span>H1</span>` : '')
            + (options.includes(' h2 ') ? `<span>H2</span>` : '')
            + (options.includes(' h3 ') ? `<span>H3</span>` : '')
            + (options.includes(' h4 ') ? `<span>H4</span>` : '')
            + (options.includes(' h5 ') ? `<span>H5</span>` : '')
            + (options.includes(' h6 ') ? `<span>H6</span>` : '')
            + (options.includes(' b ')  ? `<span>B</span>` : '')
            + (options.includes(' i ')  ? `<span><i>I</i></span>` : '')
            + (options.includes(' u ')  ? `<span style='text-decoration:underline;'>U</span>` : '')
            + (options.includes(' ul ') ? `<span data-tag='ul'>:</span>` : '')
            + (options.includes(' ol ') ? `<span data-tag='ol'>¹²³</span>` : '')
            + (options.includes(' btn-raw ') ? `<span data-tag='raw' class='`+(options.includes(' show-raw ')?'btnon':'btnoff')+`'>&lt;&bull;&gt;</span>` : '')
            ;
        _t.log('btns', btns);   
        $(this).before(
              `<div teithanheader='${tid}'>&nbsp;`
               + ( (btns=='') ? '' : `<span teithanmenu='${tid}' style='${mcss}'>≋ Menu ${btns}</span>` )
               + ( options.includes(' no-info ') ? '' : `<span teithaninfo='${tid}' style='${lcss}'>Teithan GUI HTML Editor v.${_t.version} ${_t.date}</span>` )
               + `<br style='clear:both'></div>`
        );
        if(!options.includes(' no-info ') && label)
        { if(options.includes(' no-label-delay '))
          { $(`[teithaninfo=${tid}]`).html(label);
          } else
          setTimeout(function(tid,t)
          { $(`[teithaninfo=${tid}]`).fadeOut(500,function(){$(this).html(t);}).fadeIn();
          }, 750, tid, label);
        }
        $(this).before(`<div teithaneditable='${tid}' style='${css}' contenteditable >`+$(this).text()+`</div>`);
      }
    });
  };
  this.randomString=(slength=0)=>
  { var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ0123456789abcdefghiklmnopqrstuvwxyz'.split('');
    if (!slength)
    { slength = Math.floor(Math.random() * chars.length);
    }
    _t.log(slength);
    var str='';
    while(str.length<slength)
    { str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  };
  this.change=(e)=>
  { var tid=$(e.target).attr('teithaneditable');
    $(`textarea[teithan=${tid}]`).val($(e.target).html());
    _t.log('change:',tid);
    _t.log('change64:', _t.compressToBase64(tid));
    _t.log('change64undo:',_t.decompressFromBase64(_t.compressToBase64(tid)));
    _t.saveRangePosition(tid);
  };
  this.tachange=(e)=>
  { var tid=$(e.target).attr('teithan');
    _t.log('tachange:',tid);
    $(`div[teithaneditable=${tid}]`).html($(e.target).val());
  };
  this.editevent=(e)=>
  { _t.log('edit evnt:', e);
    _t.saveRangePosition($(e.target).attr('teithaneditable'));
  };
  this.menuclick=(e)=>
  { var btn=$(e.target).data('tag') || $(e.target).text();
    _t.log('btn click:',btn);
    if($(e.target).hasClass('btnon') || $(e.target).hasClass('btnoff'))
    { $(e.target).toggleClass('btnon');
      $(e.target).toggleClass('btnoff');
    }
    var tid=$(e.target).parent().attr('teithanmenu');
    _t.log('btn menu tid:',tid);
    _t.restoreRangePosition(tid);
    switch(btn)
    { case 'raw' : if($(e.target).hasClass('btnon'))
                   { $(`textarea[teithan=${tid}]`).css('display', 'block');
                   } else
                   { $(`textarea[teithan=${tid}]`).css('display', 'none');
                   }
                   break;
    }
  };
  this.saveRangePosition=(tid)=>
  { _t.log('save to', typeof tid);
    thEditor=$(`div[teithaneditable=${tid}]`).first();
    thEditor.focus();
    _t.log('saveRangePosition:',tid);
  };
  this.restoreRangePosition=(tid)=>
  { thEditor=$(`div[teithaneditable=${tid}]`).first();
    thEditor.focus();
    _t.log('restoreRangePosition:',tid);
  };

    /*
  this.getCaretCharacterOffsetWithin=(element)=>
  {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }
  
  this.getCaretPosition=()=> {
    if (window.getSelection && window.getSelection().getRangeAt) {
      var range = window.getSelection().getRangeAt(0);
      var selectedObj = window.getSelection();
      var rangeCount = 0;
      var childNodes = selectedObj.anchorNode.parentNode.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i] == selectedObj.anchorNode) {
          break;
        }
        if (childNodes[i].outerHTML)
          rangeCount += childNodes[i].outerHTML.length;
        else if (childNodes[i].nodeType == 3) {
          rangeCount += childNodes[i].textContent.length;
        }
      }
      return range.startOffset + rangeCount;
    }
    return -1;
  }
  
  this.showCaretPos=()=> {
    var el = document.getElementById("test");
    var caretPosEl = document.getElementById("caretPos");
    caretPosEl.innerHTML = "Caret position: " + getCaretPosition(); //getCaretCharacterOffsetWithin(el);
  }
  

  this.saveRangePosition=(ctrl)=>
  { var save= { 'start': 0, 'end': 0 };
    if (ctrl.selectionStart || ctrl.selectionStart == '0')
    { save= {
        'start': ctrl.selectionStart,
        'end': ctrl.selectionEnd
      };
    } else if (document.selection)
    { // IE<9
      ctrl.focus();
      var range = document.selection.createRange();
      var rangelen = range.text.length;
      range.moveStart('character', -ctrl.value.length);
      var start = range.text.length - rangelen;
      save= { 'start': start,
              'end': start + rangelen
      };
    } else
    { // IE >=9 and other browsers, and not a text textarea
      if (typeof window.getSelection !== "undefined")
      { const sel = window.getSelection();

      }     
    }

    _t.log('save ', save);
    save = JSON.stringify(JSON.stringify(save));
    _t.log('save jj ', save);
    ctrl.data('savecursor', save);
  };
  this.restoreRangePosition=(thEditor)=>
  { thEditor.focus();
    
    var j = thEditor.data('savecursor');
    _t.log('restore ', j);
    var rp=JSON.parse(JSON.parse(j));
    _t.log('restore rp ', rp);

    var sel=window.getSelection(),range=sel.getRangeAt(0);
    var x,C,sC=thEditor,eC=thEditor;
    C=rp.sC;x=C.length;while(x--)sC=sC.childNodes[C[x]];
    C=rp.eC;x=C.length;while(x--)eC=eC.childNodes[C[x]];
    range.setStart(sC,rp.sO);
    range.setEnd(eC,rp.eO);
    sel.removeAllRanges();
    sel.addRange(range)
    
  }
  this.getNodeIndex=(n)=>{var i=0;while(n=n.previousSibling)i++;return i};
  */



  // compresssion functions from lz-string.js (c)2013 Pieroxy <pieroxy@pieroxy.net>
  // WTFPL, Version 2 see http://www.wtfpl.net/
  // http://pieroxy.net/blog/pages/lz-string/testing.html
  this.compressToBase64=(input)=>
  { if (input == null) return "";
    var res = _t._compress(input, 6, function(a){return _t.keyStrBase64.charAt(a);});
    switch (res.length % 4)
    { // To produce valid Base64
      default: // When could this happen ?
      case 0 : return res;
      case 1 : return res+"===";
      case 2 : return res+"==";
      case 3 : return res+"=";
    }
  }
  this.decompressFromBase64=(input)=> {
    if (input == null) return "";
    if (input == "") return null;
    return _t._decompress(input.length, 32, function(index) { return _t.getBaseValue(_t.keyStrBase64, input.charAt(index)); });
  };
  this.getBaseValue=(alphabet, character)=>
  { if (!_t.baseReverseDic[alphabet])
    { _t.baseReverseDic[alphabet] = {};
      for (var i=0 ; i<alphabet.length ; i++)
      { _t.baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return _t.baseReverseDic[alphabet][character];
  };
  this._compress=(uncompressed, bitsPerChar, getCharFromInt)=> {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  };
  this.decompress=(compressed)=> {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return _t._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  };
  this._decompress=(length, resetValue, getNextValue)=> {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = _t.f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = _t.f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = _t.f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = _t.f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }

};
teithan = new GUITeithan;
teithan.init();
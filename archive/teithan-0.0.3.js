/* ----------------------------------------------------------------------------------
 *   _      (̅_) _  |‾| gui text editor    (c) Sevarian  2022.05.03   v00.00.03
 *  | |_ ___ _ | |_| |__  ___ ____            aka. Ian Jukes <spayz@realgamer.org>
 * (   _) _ | (   _)  _ \(__ |  _ \       This work is free. You can redistribute it
 *  | |_| __| || |_| | | / _ | | | |      and/or modify itunder the terms of the 
 *   \__)___)_| \__)_| |_\___|_| |_|      GPL v2 (or later versions),
 *                                        https://www.gnu.org/licenses/gpl-2.0.txt
 *                                        for more info see http://amazer.uk/projects
 * ----------------------------------------------------------------------------------- */
function GUITeithan()
{ let _t = this;
  _t.version='0.0.3';
  _t.date='2022-05-03';
  _t.log = console.log;
  //this.log = ()=>{}; //production
  _t.f = String.fromCharCode;
  _t.alloptions='';
  _t.settings=[];

  _t.init=() =>
  { $('document').ready(function()
    { _t.refresh();
      setTimeout(function()
      { _t.refresh();
      },5000);
      $('body').on('input','div[teithaneditable]', _t.change);
      $('body').on('input','textarea[teithan]', _t.tachange);
      $('body').on('keyup click','div[teithaneditable]', _t.editevent);
      $('body').on('mousedown','span[teithanmenu] span', _t.menuMouseDown);
    });
  };
  _t.refresh=() =>
  { var alloptions=' ';
    $('textarea[teithan]').each(function()
    { alloptions += $(this).data('options')+' ' ;
    });
    _t.alloptions=alloptions;
    if(!_t.alloptions.includes(' no-css ') && $('style[teithan]').length==0)
    { $('body').prepend(`<style type='text/css' teithan>`
          +`[teithaneditable]{border:2px solid black;border-radius:1em;padding:0.5em;overflow:auto;position:relative;z-index:20;}`
          +`[teithanheader]{}`
          +`[teithanmenu]{border:2px solid silver;border-radius:0.5em;background:white;float:right;z-index:2;}`
          +`[teithanmenu] span{font-family:serif;cursor:default;margin:2px 0px 2px 0.25em;border:1px solid silver;border-radius:0.3em;padding:2px 4px;background-color:lightgray;color:black;min-width:1.25em;display:inline-block;text-align:center;}`
          +`[teithanmenu] span.btnoff{background-color:#eee;}`
          +`[teithanmenu] span.btnon{background-color:lime;}`
          +`[teithanmenu] span:hover{background-color:darkgray;color:white;}`
          +`</style>`);
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
            + (options.includes(' ul ') ? `<span data-tag='ul'>&vellip;</span>` : '')
            + (options.includes(' ol ') ? `<span data-tag='ol'>&sup1;&sup2;&sup3;</span>` : '')
            + (options.includes(' btn-raw ') ? `<span data-tag='raw' class='`+(options.includes(' show-raw ')?'btnon':'btnoff')+`'>&lt;&bull;&gt;</span>` : '')
            ;
        _t.log('btns', btns);   
        $(this).before(
              `<div teithanheader='${tid}' charset="utf-8">&nbsp;`
               + ( (btns=='') ? '' : `<span teithanmenu='${tid}' style='user-select:none;${mcss}'>`
                                    + (options.includes(' no-menu-name ') ? '' :`&apid; Menu `) +`${btns}</span>` )
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
        $(this).before(`<div teithaneditable='${tid}' style='${css}' contenteditable charset="utf-8">`+$(this).text()+`</div>`);
      }
    });
  };
  _t.randomString=(slength=0)=>
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
  _t.change=(e)=>
  { var tid=$(e.target).attr('teithaneditable');
    $(`textarea[teithan=${tid}]`).val($(e.target).html());
    _t.log('change:',tid);
    _t.log('change64:', _t.compressToBase64(tid));
    _t.log('change64undo:',_t.decompressFromBase64(_t.compressToBase64(tid)));
    _t.saveRangePosition(tid);
  };
  _t.tachange=(e)=>
  { var tid=$(e.target).attr('teithan');
    _t.log('tachange:',tid);
    $(`div[teithaneditable=${tid}]`).html($(e.target).val());
  };
  _t.editevent=(e)=>
  { _t.log('edit evnt:', e);
    _t.saveRangePosition($(e.target).attr('teithaneditable'));
  };
  _t.menuMouseDown=(e)=>
  { e.stopImmediatePropagation();
    e.preventDefault();
    _t.log('btn m-down');

    var btn=$(e.target).data('tag') || $(e.target).text();
    btn = btn.toLowerCase();
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
      case 'b'   : document.execCommand('bold',false);
                   break;
      case 'i'   : document.execCommand('italic',false);
                   break;
      case 'u'   : document.execCommand('underline',false);
                   break;
      case 'h1'  : //https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
      case 'h2'  :
      case 'h3'  :
      case 'h4'  :
      case 'h5'  :
      case 'h6'  : if(!document.execCommand('heading',false, btn.toUpperCase()))
                   { document.getSelection().collapseToStart();
                     var st=document.getSelection().anchorOffset;
                     var ln = document.getSelection().anchorNode.parentElement.localName.toLowerCase();
                     var pE = document.getSelection().anchorNode.parentElement;
                     _t.log('localName', ln );
                     if (ln==btn)
                     { pE.outerHTML=`<p>`+pE.innerHTML+`</p>`
                     } else if(ln=='p' || (ln.startsWith('h')))
                     { pE.outerHTML=`<${btn}>`+pE.innerHTML+`</${btn}>`
                     }
                   }
                   break;
      case 'ul'  : document.execCommand('insertUnorderedList',false);
                   break;
      case 'ol'  : document.execCommand('insertOrderedList',false);
                   break;
    }
  }
  _t.saveRangePosition=(tid)=>
  { _t.log('save to', typeof tid);
    thEditor=$(`div[teithaneditable=${tid}]`).first();
    thEditor.focus();
    _t.log('saveRangePosition:',tid);
  };
  _t.restoreRangePosition=(tid)=>
  { thEditor=$(`div[teithaneditable=${tid}]`).first();
    thEditor.focus();
    _t.log('restoreRangePosition:',tid);
  };
};
teithan = new GUITeithan;
teithan.init();
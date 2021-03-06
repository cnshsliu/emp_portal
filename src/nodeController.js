'use strict';

const NodeController = {
  locked: (jqNode) => {
    return jqNode.hasClass('lock');
  },
  lock: (jqNode) => {
    if (!jqNode) {
      console.warn('lock a no existing node');
      return;
    }
    // console.log("Before", jqNode.prop('outerHTML'));
    jqNode.addClass('lock');
    let lockLabel = jqNode.find('.locklabel');
    if (lockLabel.length === 0) {
      // console.log('add locklabel for', jqNode.attr('id'));
      jqNode.append('<div class="locklabel"/>');
    // }else{
    //   console.log('locklabel exist..', lockLabel);
    }
    // console.log("After", jqNode.prop('outerHTML'));
    
    NodeController.safeNodeEventModify(jqNode, "draggable", 'disable');
    NodeController.safeNodeEventModify(jqNode, "resizable", 'disable');
    NodeController.safeNodeEventModify(jqNode, "droppable", 'disable');
  },
  lockline: (KFK,line) => {
    if (!line) { console.warn('lock a no existing line'); return; }
    line.addClass('lock');
    KFK.lockLine(line);
  },
  unlockline: (KFK,line) => {
    if (!line) { console.warn('unlock a no existing line'); return; }
    line.removeClass('lock');
    KFK.lockLine(line, false);
  },
  safeNodeEventModify: (jqNode, action, flag)=>{
    if(jqNode === undefined){
      console.log(new Error().stack);
    }
    if(action === 'draggable' && jqNode.hasClass('ui-draggable')){
        jqNode.draggable(flag);
    }else if(action === 'resizable' && jqNode.hasClass('ui-resizable')){
        jqNode.resizable(flag);
    }else if(action === 'droppable' && jqNode.hasClass('ui-droppable')){
        jqNode.droppable(flag);
    }
  },
  unlock: (jqNode) => {
    if (!jqNode) {
      console.warn('unlock a no existing node');
      return;
    }
    jqNode.removeClass('lock');
    let lockLabel = jqNode.find('.locklabel');
    if (lockLabel.length > 0) {
      lockLabel.first().remove();
    }
    NodeController.safeNodeEventModify(jqNode, "draggable", 'enable');
    NodeController.safeNodeEventModify(jqNode, "resizable", 'enable');
    NodeController.safeNodeEventModify(jqNode, "droppable", 'enable');
  },
};

export {NodeController};

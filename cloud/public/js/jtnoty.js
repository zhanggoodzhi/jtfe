function alert(text,type) {
    var n = noty({
        text        : text,
        type        : type,
        dismissQueue: true,
        killer      : true,
        timeout     : 1000,
        layout      : 'center',
        modal: true,
        theme       : 'defaultTheme',
        maxVisible  : 10
    });
    console.log('html: ' + n.options.id);
}
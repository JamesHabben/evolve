function GetPluginList () {
    set_timer = false
    set_timer_done = false
    $.ajax({url:'data/plugins',dataType:'json'}).success(
        function (data) {
            $('#pluglist').html('')
            $.each($.grep(data.plugins,
                function(d,i) {
                    return d.data == 1
                }),
                function(k,v) {
                    $('#pluglist').append(
                    '<div class="plugin plugindata" title="' + v.help + '">' +
                    v.name +
                    '<span class="pluginshowdata" onclick="GetData(\'' + v.name + '\')">' +
                    'show' +
                    '</span></div>')
                }
            )
            $.each($.grep(data.plugins,
                function(d,i) {
                    return d.data == 0 || d.data == 2
                }),
                function(k,v) {
                    tag_string = '<div class="plugin" title="' + v.help + '">' + v.name
                    if (v.data == 0) {
                        tag_string += '<span class="pluginrun" onclick="RunPlugin(\'' + v.name + '\',this)">' +
                                      'run</span></div>'
                    }
                    else {
                        tag_string += '<span class="pluginrunning" >running</span></div>'
                        set_timer = true
                    }
                    $('#pluglist').append(tag_string)
                }
            )
            $('#morphlist').html('')
            $.each(data.morphs, function(k,v) {
                    $('#morphlist').append(
                    '<div class="plugin plugindata" title="' + v.display + '\n' + v.helptext + '">' +
                    v.name +
                    '<span class="pluginshowdata" onclick="ShowMorphConfig(\'' + v.name + '\')">config</span>' +
                    '</div>')
                    $.each(v.plugins, function(pk,pv) {
                        $('#morphlist').append(
                            '<div class="plugin plugindata"><li>' + pv + '' +
                            '<span class="pluginshowdata" onclick="GetMorph(\'' + pv + '\',\'' + v.name + '\')">show' +
                    '</span></li></div>'
                        )
                    })
            })
            if (set_timer && set_timer_done == false) {
                setTimeout(GetPluginList, 1000)
                set_timer_done = true
            }
        }
    )

}

function GetMeta () {
    $.getJSON('/data/meta', function(data) {
        $('#volver').html(data.volversion)
        $('#evover').html('v' + data.evolveversion)
        $('#dumpfile').html( data.filepath)
        $('#profile').html( data.profilename)
    })
}

function ProfileDropClick () {
    $('#profilelistbox').html('')
    if ($('#profilelistbox').is(':hidden')) {
        $.getJSON('/data/profilelist', function(data) {
            listHtml = '<ul>'
            $.each(data, function(k, v) {
                listHtml += '<li onclick="SetProfile(\'' + v[0] + '\')">' + v[0]
            })
            listHtml += '</ul>'
            $('#profilelistbox').html(listHtml)
            $('#profilelistbox').toggle()
        })
    }
    else {
        $('#profilelistbox').toggle()
    }
}

function SetProfile (pname) {
    $.ajax({url:'/config/profile/' + pname}).success(function(){
        GetMeta()
        $('#profilelistbox').toggle()
        GetPluginList()
    })
}

function ShowMorphConfig (morphname) {
    $.getJSON('/config/morph/' + morphname , function(data) {
        $('#configview').css({'display':'block'})
        $('#dataview').css({'display':'none'})
        $('#confighdr').html(data.display + ' Configuration')
        $('#confighelptext').html(data.helptext)
        $('#saveallbtn').click(SetMorphConfig)
        $('#configmsg').html('')
        $('#configmsg').removeAttr('class')
        $('#configbodycontainer').html('')
        $('#configbodycontainer').append('<input type="hidden" id="hdnconfighdr" value="' + data.name + '" />')
        $.each(data.config, function(k, v) {
            tagtext = '<div id="' + k + '" class="configbox"><div class="configboxhdr">' + v.name + '</div>' +
                      '<div class="configboxdesc">' + v.description + '</div>'
            if (typeof v.value == 'undefined') {
                v['value'] = ''
            }
            if (v.value == '' && v.defaultvalue && v.defaultvalue != '') {
                v.value = v.defaultvalue
            }
            requiredcls = ''
            requirednote = ''
            if (v.required) {
                requiredcls = ' frmrequired'
                requirednote = '<span class="reqnote">Required</span>'
            }
            if (v.type == 'string') {
                tagtext += '<div class="frmfielddiv"><input type="text" class="frmfield fieldstring' + requiredcls + '" id="frm' + k +
                '" value="' + v.value + '" /></div>'
            }
            else if (v.type == 'path') {
                tagtext += '<div class="frmfielddiv"><input type="text" class="frmfield fieldpath' + requiredcls + '" id="frm' + k +
                           '" value="' + v.value + '" />' +
                           '<span class="browsebtn" id="browse' + k + '" onclick="ShowPathDialog(\'frm' + k + '\')">Browse...</span></div>'
            }
            else if (v.type == 'bool') {
                tagtext += '<div class="frmfielddiv">'+
                           '<input type="checkbox" class="frmfield fieldpath' + requiredcls + '" style="width:auto" id="frm' + k + '" value="true"'
                if (v.value == true || v.value == 'true') {
                    tagtext += ' checked'
                }
                tagtext += ' /></div>'
            }
            else if (v.type == 'number') {
                tagtext += '<div class="frmfielddiv"><input type="text" class="frmfield fieldnumber' + requiredcls + '" id="frm' + k +
                '" value="' + v.value + '" /></div>'
            }
            tagtext += requirednote + '</div>'
            $('#configbodycontainer').append(tagtext)
        })
    })
}

function SetMorphConfig () {
    //$('#configmsg').slideUp()
    $('.frmrequired').removeAttr('style')
    $('#configmsg').removeAttr('class')
    senddata = {}
    formError = false
    $.each($('.frmrequired'), function(k, v) {
        if (v.value == '') {

            $('#' + v.id).css({'background':'pink'})
            formError = true
        }
    })
    if (formError == true) {
        $('#configmsg').text('Required fields need to be filled')
        $('#configmsg').addClass('configmsgerr')
        $('#configmsg').slideDown()
        return
    }
    $.each($('.frmfield'), function(k, v) {
        if (v.type == 'checkbox') {
            senddata[v.id.slice(3)] = false
            if (v.checked == true) {
                senddata[v.id.slice(3)] = true
            }
        }
        else if ($(this).hasClass('fieldnumber')) {
            senddata[v.id.slice(3)] = parseFloat(v.value)
        }
        else {
            senddata[v.id.slice(3)] = v.value
        }
    })
    $.ajax({url:'/config/morph/' + $('#hdnconfighdr').val(),
            method: 'post',
            data:JSON.stringify( senddata),
            dataType:'json',
            contentType:'application/json'
    }).success(function (data) {
        if (data.result == 'success') {
            $('#configmsg').text('Config saved')
            //$("#configmsg").css({'display':'block'})
            $('#configmsg').addClass('configmsggood')
            $('#configmsg').slideDown()
        }
        else {
            $('#configmsg').text('Config error: ' + data.msg)
            //$("#configmsg").css({'display':'block'})
            $('#configmsg').addClass('configmsgerr')
            $('#configmsg').slideDown()
        }
    })
}

function ShowPathDialog (field) {
    $('#background').css({opacity:0.7}).fadeIn('slow')
    $('#filetreediv').fileTree({
        root: '/',
        script: '/browse/server',
        expandSpeed: 200,
        collapseSpeed: 200,
        multiFolder: false
    }, function(file) {
        $('#' + field).val(file)
        $('#background').fadeOut('slow')
        $('#filetreediv').fadeOut('slow')
    })
    $('#filetreediv').css({'left':($(window).width() / 3) + 'px', 'max-height':($(window).height() - 70)})

    $('#filetreediv').fadeIn('slow');
    $('#background').click(function() {
        $('#background').fadeOut('slow')
        $('#filetreediv').fadeOut('slow')
    })
}

function ShowLoading () {

}

function GetData (pluginname) {
    $('#sqlerror').css({'display':'none'})
    //$('#loading').css({opacity:0.7, 'display':'block'})//.fadeIn()
    $('#loading').css({'display':'block'})
    //$('#loading').fadeIn('slow')
    $.getJSON('/data/view/' + pluginname , function(data) {
        ShowData(data)
    })
}

function GetMorph (pluginname, morphname) {
    $.getJSON('/data/view/' + pluginname + '/morph/' + morphname, function(data) {
        ShowData(data)
        $('#tag' + morphname).addClass('activemorphtag')
            .on('click', this, function() {
                GetData(pluginname)
            })

    })
}

function ShowData (data) {
    $('#configview').css({'display':'none'})
    //$('#loading').css({'display':'none'})
    $('#loading').fadeOut()
    var tbl_body = '';
    var odd_even = false;
    tbl_body = '<thead>'
    $.each(data.columns, function(k, v) {
        //tbl_body += '<td class="datatablehdr">' + v + '</td>'
        tbl_body += '<td>' + v + '</td>'
    })
    tbl_body += '</thead>'
    $.each(data.data, function() {
        var tbl_row = ""
        setAlert = false
        $.each(this, function(k, v) {
            if (v !== null && typeof v === 'object') {
                style = ''
                if (v.style) {
                    style = ' style="' + v.style + '"'
                }
                tooltip = ''
                if (v.tooltip) {
                    tooltip = ' title="' + v.tooltip + '"'
                }
                classtext = ''
                if (v.blinkbg) {
                    classtext = ' class="alert"'
                    setAlert = true
                }
                tbl_row += '<td' + style + tooltip + classtext + '>' + v.value + '</td>'
            }
            else {
                tbl_row += '<td>' + v + '</td>'
            }
        })
        if (setAlert) {
            /*setInterval(function(){
                $.each($(".alert"), function (k, v) {
                    alert(this.css())
                    if (v) {

                    }
                    //v.toggleClass("backgroundRed");
                })
            },100)*/
        }
        tbl_body += '<tr class="' + (odd_even ? 'odd' : 'even') + '">' + tbl_row + '</tr>'
        //tbl_body += '<tr>' + tbl_row + '</tr>'
        odd_even = !odd_even
    })
    $('#morphtags').html('')
    $.each(data.morphs, function() {
        morphname = this
        $('#morphtags').append('<span onclick="GetMorph(\'' + data.name + '\', \'' + this + '\')" class="morphtag" id="tag' + this + '">' +
            this + '</span>')
            //.addclass('activemorphtag')
        //$('#tag' + this).on('click', this, function() {
        //    GetMorph(data.name, morphname)
        //})
    })
    $('#datahdr').html(data.name)
    $('#datasql').val(data.query)
    $('#datatable_wrapper').remove()
    $('#dataview').append('<table id="datatable" class="">' + tbl_body + '</table>')
    //$('#datatable').html(tbl_body)
    $('#dataview').css({'display':'block'})
    $('#datatable').DataTable({
        'dom':'RClfrtip',
        'lengthMenu': [[25, 50, 100, -1], [25, 50, 100, 'All']],
        'pageLength':100,
        'scrollY':'68%',
        'scrollX': true
    })
    $('#datatable').addClass('display')
}

function ShowDataFancy (pluginname) {
    $.getJSON('/data2/plugin/' + pluginname , function(data) {
        colarray = []
        $.each(data.columns, function(k, v) {
            colarray.push(v)
        })
        $("#datatable").jqGrid({
            colModel: data.columns,
            colNames: colarray,
            datatype: 'clientside',
            data: data.data
        })
    })
}

function RunPlugin (pluginname, callingobj) {
    $(callingobj).html('running')
    $(callingobj).css({'background':'lightgrey', 'cursor':'none'})
    $.ajax({url:'/run/plugin/' + pluginname})
    setTimeout(GetPluginList, 1000)
}

var SqlShown = false

function ShowSql () {
    if (!SqlShown) {
        //$("#sqlcontainer").css({"display":"block"})
        $("#sqlcontainer").slideDown()
        $("#showsqlbutton").html("Hide SQL")
    }
    else {
        //$("#sqlcontainer").css({"display":"none"})
        $("#sqlcontainer").slideUp()
        $("#showsqlbutton").html("Show SQL")
    }
    SqlShown = !SqlShown
}

function RunSql () {
    $("#sqlerror").text()
    $("#sqlerror").css({'display':'none'})
    senddata = {"query": $("#datasql").val()}
    $.ajax({url:'/data/view/' + $("#datahdr").text(),
            method: 'post',
            data: senddata,
            dataType:'json'
            }).success(function (data) {
                if (data.error) {
                    $("#sqlerror").text(data.error)
                    //$("#sqlerror").css({'display':'block'})
                    $("#sqlerror").slideDown()
                }
                else {
                    ShowData(data)
                }
            })
}

function TabClickPlugin () {
    $('#tabplugin').addClass('activetab')
    $('#tabmorph').removeClass('activetab')
    $('#pluglist').css({'display':'block'})
    $('#morphlist').css({'display':'none'})
    $('#tabmorph').click(TabClickMorph)
    $('#tabplugin').click(null)
}
function TabClickMorph () {
    $('#tabmorph').addClass('activetab')
    $('#tabplugin').removeClass('activetab')
    $('#morphlist').css({'display':'block'})
    $('#pluglist').css({'display':'none'})
    $('#tabplugin').click(TabClickPlugin)
    $('#tabmorph').click(null)
}

$(function() {
    //  changes mouse cursor when highlighting lower right of box
    $("textarea").mousemove(function(e) {
        var myPos = $(this).offset();
        myPos.bottom = $(this).offset().top + $(this).outerHeight();
        myPos.right = $(this).offset().left + $(this).outerWidth();

        if (myPos.bottom > e.pageY && e.pageY > myPos.bottom - 16 && myPos.right > e.pageX && e.pageX > myPos.right - 16) {
            $(this).css({ cursor: "nw-resize" });
        }
        else {
            $(this).css({ cursor: "" });
        }
    })
    //  the following simple make the textbox "Auto-Expand" as it is typed in
    .keyup(function(e) {
        //  this if statement checks to see if backspace or delete was pressed,
        //  if so, it resets the height of the box so it can be resized properly
        if (e.which == 8 || e.which == 46) {
            $(this).height(parseFloat($(this).css('min-height')) != 0 ?
                parseFloat($(this).css('min-height')) : parseFloat($(this).css('font-size')));
        }
        //  the following will help the text expand as typing takes place
        while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css('borderTopWidth')) +
                parseFloat($(this).css('borderBottomWidth'))) {
            $(this).height($(this).height()+1);
        };
    });
});

$(document).ready(function() {
    GetMeta()
    GetPluginList()
    $('#showsqlbutton').click(ShowSql)
    $('#runsqlbutton').click(RunSql)
    $('#datasql').on('keydown', this, function (event) {
        if (event.keyCode == 116) {
            RunSql()
            return false;
        }
    })
    //$("#")
    $('#tabmorph').click(TabClickMorph)
    $('#profiledrop').click(ProfileDropClick)
})

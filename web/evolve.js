function GetPluginList () {
    set_timer = false
    $.ajax({url:'data/plugins',dataType:'json'}).success(
        function (data) {
            $("#pluglist").html("")
            $.each($.grep(data.plugins,
                function(d,i) {
                    return d.data == 1
                }),
                function(k,v) {
                    $("#pluglist").append(
                    '<div class="plugindata" title="' + v.help + '">' +
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
                    $("#pluglist").append(tag_string)
                }
            )
            if (set_timer) {
                setTimeout(GetPluginList, 1000)
            }
        }
    )

}

$.ajax({url:'data/volversion'}).success(
    function (data) {
        $("#volver").html(data)
    }
)

$.ajax({url:'data/evolveversion'}).success(
    function (data) {
        $("#evover").html('v' + data)
    }
)

$.ajax({url:'data/filepath'}).success(
    function (data) {
        $("#dumpfile").html( data)
    }
)

$.ajax({url:'data/profilename'}).success(
    function (data) {
        $("#profile").html( data)
    }
)

function GetData (pluginname) {
    $.getJSON('/data/view/' + pluginname , function(data) {
        ShowData(data)
    })
}

function ShowData (data) {
    //$.getJSON('/data/view/' + pluginname , function(data) {
        var tbl_body = '';
        var odd_even = false;
        tbl_body = '<tr>'
        $.each(data.columns, function(k, v) {
            tbl_body += '<td class="datatablehdr">' + v + '</td>'
        })
        tbl_body += '</tr>'
        $.each(data.data, function() {
            var tbl_row = ""
            $.each(this, function(k, v) {
                tbl_row += '<td>' + v + '</td>'
            })
            tbl_body += '<tr class="' + (odd_even ? 'odd' : 'even') + '">' + tbl_row + '</tr>'
            odd_even = !odd_even
        })
        $("#datahdr").html(data.name)
        $("#datasql").val(data.query)
        $("#datatable").html(tbl_body)
        $("#dataview").css({"display":"inline"})
    //})
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
        $("#sqlcontainer").css({"display":"block"})
        $("#showsqlbutton").html("Hide SQL")
    }
    else {
        $("#sqlcontainer").css({"display":"none"})
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
                    $("#sqlerror").css({'display':'block'})
                }
                else {
                    ShowData(data)
                }
            })
}

$(function() {
    //  changes mouse cursor when highlighting loawer right of box
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
        //  this if statement checks to see if backspace or delete was pressed, if so, it resets the height of the box so it can be resized properly
        if (e.which == 8 || e.which == 46) {
            $(this).height(parseFloat($(this).css("min-height")) != 0 ? parseFloat($(this).css("min-height")) : parseFloat($(this).css("font-size")));
        }
        //  the following will help the text expand as typing takes place
        while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
            $(this).height($(this).height()+1);
        };
    });
});

$(document).ready(function() {
    GetPluginList()
    $("#showsqlbutton").click(ShowSql)
    $("#runsqlbutton").click(RunSql)
    $("#datasql").on("keydown", this, function (event) {
        if (event.keyCode == 116) {
            RunSql()
            return false;
        }
    })
    $("#")
})

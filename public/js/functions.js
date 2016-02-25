/**
 * Created by Seiji on 1/28/2016.
 */

/****************************** LOGIN CONTROLS **********************************/
function validateLogin(e) {
    console.log("entering validation...");

    /*$.ajax({
        'type': 'POST',
        'url': '/validate',
        'success': function(response)
        {
            $("body").html(response);
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });*/

    e.preventDefault();
}



/**************************** NAV BUTTON CONTROLS ********************************/
/*function showRequirements(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/requirements-view',
        'success': function(response)
        {
            $(".main-content").html(response);
            $('#logo').hide();
            $('.back-btn').show();
            backBtnFunction = showPlanner;
            $('.back-btn')[0].addEventListener('click', backBtnFunction);
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}*/

function showPlanner(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/planner-view',
        'success': function(response)
        {
            $(".main-content").html(response);
            $('.quarter').click( showClickedQuarter );
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

function showDepartments(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/department-listing-view',
        'success': function(response)
        {
            // Update displayed content
            $(".main-content").html(response);

            // Link all departments to the proper next page
            $.each( $('.department-list ul li'), function(index, elem) {
                elem.addEventListener('click', showDeptClasses);
            });
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

/************************** CONTROLS FOR DEPARTMENT PAGES ***********************************/
function showDeptClasses(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/course-listing/' + /^[a-z]+/.exec(e.srcElement.id)[0],
        'success': function(response)
        {
            $(".main-content").html(response);
            $.each( $('.course-list ul li'), function(index, elem) {
                elem.addEventListener('click', showCourseDescription);
            });
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

/*
 * Handles redirection to the proper course description
 */
function showCourseDescription(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/course-description/'+ e.srcElement.id,
        'success': function(response)
        {
            $(".main-content").html(response);
            $(".course-description .add")[0].addEventListener('click', showQuarterSelection);
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

/*
 * Display all quarters and allow adding selected class to specified quarter.
 */
function showQuarterSelection(e) {
    e.preventDefault();

    $.ajax({
        'type': 'GET',
        'url': '/parts/choose-quarter/'+e.srcElement.parentNode.id,
        'success': function(response)
        {
            $(".main-content").html(response);
            $('.past').hide();
            $.each($(".addToQuarter"), function(index, elem) {elem.addEventListener('click', addClass)});
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

/*
 * Function will POST to /add-class/:class/:quarter/:year and it will be added to the user-data.json file
 */
function addClass(e) {
    e.preventDefault();

    var choosenClass = $('.choosenClass')[0].innerHTML;
    var choosenQuarter = e.srcElement.parentNode.id;

    $.ajax({
        'type': 'POST',
        'url': '/parts/add-class/'+choosenQuarter+'/'+choosenClass,
        'success': function(response)
        {
            $(".main-content").html(response);
            $('.quarter').click( showClickedQuarter );
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

function showClickedQuarter(e) {
    e.preventDefault();
    //var quarterArr = e.srcElement.parentNode.parentNode.parentNode.childNodes[1].innerHTML.split('<br>');

    $.ajax({
        'type': 'GET',
        'url': '/parts/show-quarter/'+e.toElement.id,
        'success': function(response)
        {
            $(".main-content").html(response);
            $('.class-del').click( deleteClass );
            $('.class-mv').click( moveClass );
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

function deleteClass(e, stepOne) {
    var className = e.toElement.parentNode.children[0].innerHTML;
    var currentQuarter = document.getElementsByTagName('h1')[1].id;

    $.ajax({
        'type': 'POST',
        'url': '/parts/rm-class-from-quarter/'+ currentQuarter +'/'+className,
        'success': function(response)
        {
            if( !stepOne ) {
                $(".main-content").html(response);
                $('.class-del').click( deleteClass );
                $('.class-mv').click( moveClass );
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}

function moveClass(e) {
    var className = e.toElement.parentNode.children[0].innerHTML;
    className = className.split(' ')[0].toLowerCase() + className.split(' ')[1];
    deleteClass( e, true );

    $.ajax({
        'type': 'GET',
        'url': '/parts/choose-quarter/'+className,
        'success': function(response)
        {
            $(".main-content").html(response);
            $('.past').hide();
            $.each($(".addToQuarter"), function(index, elem) {elem.addEventListener('click', addClass)});
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            console.log('Error on saving appointment:', jqXHR, textStatus, errorThrown);
        }
    });
}



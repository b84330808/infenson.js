 var isCtrl = false;
 $("body").keydown(function(e) {

     e = e || window.event;
     if (e.ctrlKey) {
         console.log(e.which);
         switch (e.which) {
             case 222:
                 {
                     focusedThing = $(":focus"); //get the focused thing
                     if (focusedThing.hasClass('terminal')) { //maybe the focused thing is not a terminal (background..etc.)
                         focusedTerm = focusedThing;

                         var termManKeys = Object.keys(termMan);
                         var termManLength = termManKeys.length;

                         var nextFocusedTermId;
                         var nextFocusedTerm;

                         for (var i = 0; i < termManLength; i++) {
                             if (focusedTerm.attr('id') == termManKeys[i]) {
                                 nextFocusedTermId = termManKeys[(i + 1)] || termManKeys[0]; //loop
                                 nextFocusedTerm = $('#' + nextFocusedTermId);
                                 break;
                             };
                         }

                         $(focusedTerm).css('background-color', '#000000');
                         $(nextFocusedTerm).css('background-color', '#1A1B1A');
                         $(nextFocusedTerm).focus();
                         focusedTerm = nextFocusedTerm;

                     } else {
                         focusedTerm.focus();
                     }
                 }
                 break;
             case 186:
                 {
                     focusedThing = $(":focus"); //get the focused thing
                     if (focusedThing.hasClass('terminal')) { //maybe the focused thing is not a terminal (background..etc.)
                         focusedTerm = focusedThing;

                         var termManKeys = Object.keys(termMan);
                         var termManLength = termManKeys.length;

                         var nextFocusedTermId;
                         var nextFocusedTerm;

                         for (var i = 0; i < termManLength; i++) {
                             if (focusedTerm.attr('id') == termManKeys[i]) {
                                 nextFocusedTermId = termManKeys[(i - 1)] || termManKeys[(termManLength - 1)]; //loop
                                 console.log(nextFocusedTermId);
                                 nextFocusedTerm = $('#' + nextFocusedTermId);
                                 break;
                             };
                         }

                         $(focusedTerm).css('background-color', '#000000');
                         $(nextFocusedTerm).css('background-color', '#1A1B1A');
                         $(nextFocusedTerm).focus();
                         focusedTerm = nextFocusedTerm;

                     } else {
                         focusedTerm.focus();
                     }
                 }
                 break;

         }

     }
 });

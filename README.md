# jQuery jSlots

jSlots is 2k of jQuery slot machine magic. It turns any list (`<ol>` or `<ul>`) into a slot machine!

## Options

These are the options, with their default values, and what they do

        $.jSlots.defaultOptions = {
            number : 3,          // Number: number of slots
            winnerNumber : 0,    // Number or Array: list item number(s) upon which to trigger a win
            spinner : '',        // CSS Selector: element to bind the start event to
            spinEvent : 'click', // String: event to start slots on this event
            onStart : $.noop,    // Function: runs on spin start,
            onEnd : $.noop,      // Function: run on spin end. It is passed (finalNumbers:Array). finalNumbers gives the index of the li each slot stopped on in order.
            onWin : $.noop,      // Function: run on winning number. It is passed (winCount:Number, winners:Array)
            easing : 'swing',    // String: easing type for final spin
            time : 7000,         // Number: total time of spin animation
            loops : 6,            // Number: times it will spin during the animation
            displayOrder : "DESC",   // Stop spinner rotation ASC is Right to Left  DESC is Left to right
            winningNumArray : Array(),  // This allows a specific number to be the winner
        };
## Usage

Attach jQuery (successfully tested down to v1.4.1)

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>

Attach jSlots plugin

    <script src="jquery.jSlots.js" charset="utf-8"></script>

Attach easing plugin (optional but HIGHLY recommended for nice animation)

    <script src="jquery.easing.1.3.js" charset="utf-8"></script>

Create a list and an element that will spin the slots

    <ul class="slot">
        <li>0</li>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
        <li>1</li>
        <li>8</li>
        <li>9</li>
    </ul>

    <!-- this button will start the spin -->
    <input type="button" id="playBtn" value="play">

Target the list and make it a jSlot!

    <script type="text/javascript" charset="utf-8">

        $('.slot').jSlots({
            spinner : '#playBtn',
            winnerNumber : 7
        });

    </script>

Styling is up to you, but jSlots supplies a jSlots-wrapper div around your lists that should get `overflow: hidden` and a height set on it. Here are some recommended styles:

    .jSlots-wrapper {
        overflow: hidden; /* to hide the magic */
        height: 20px; /* whatever the height of your list items are */
        display: inline-block; /* to size width correctly, can use float too, or width*/
        border: 1px solid #999;
    }
Add @media declarations for responsive
    
          .slot {
              float: left;
              padding: 0 10px;
              border: 1px solid #333;
          }
          .slot li {
            padding: 0;
            height: 300px;
            font-size: 300px;
            line-height: 1;
          }
          /*. Media query */
        @media (min-width: 1281px) {
        }

        /* 
          ##Device = Laptops, Desktops
          ##Screen = B/w 1025px to 1280px
        */

        @media (min-width: 1025px) and (max-width: 1280px) {
        }

        /* 
          ##Device = Tablets, Ipads (portrait)
          ##Screen = B/w 768px to 1024px
        */

        @media (min-width: 768px) and (max-width: 1024px) {
        }
        /* 
          ##Device = Tablets, Ipads (landscape)
          ##Screen = B/w 768px to 1024px
        */

        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .jSlots-wrapper {
            height: 175px;
          }
          .slot li {
            padding: 0;
            height: 175px;
            font-size: 175px;
            line-height: 1;
          }
        }

        /* 
          ##Device = Low Resolution Tablets, Mobiles (Landscape)
          ##Screen = B/w 481px to 767px
        */

        @media (min-width: 481px) and (max-width: 767px) {
          .jSlots-wrapper {
            height: 100px;
          }
          .slot li {
            padding: 0;
            height: 100px;
            font-size: 100px;
            line-height: 1;
          }
          
          
        }

        /* 
          ##Device = Most of the Smartphones Mobiles (Portrait)
          ##Screen = B/w 320px to 479px
        */

        @media (min-width: 320px) and (max-width: 480px) {
          .jSlots-wrapper {
            height: 70px;
          }
          .slot li {
            padding: 0;
            height: 70px;
            font-size: 70px;
            line-height: 1;
          }
        }

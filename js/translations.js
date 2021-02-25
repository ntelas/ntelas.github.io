/**
 * 
 * @name:       translatorjs
 * @version:    3.1.0
 * @author:     EOussama
 * @license     MIT
 * @source:     https://github.com/EOussama/translatorjs
 * 
 * A simple javascript library for translating web content.
 * 
 */

'use strict';

window.addEventListener('load', () => {

  // Creating a dictionary
  var dictionary = {
    'en': {
      'intro': '<h1>Marios Pentelas</h1><h5>Web Design & Software Developement</h5>\
	  <p>I am student at an Institute of Vocational Training in Thessaloniki, Greece. \
	  I am currently studying Web development (PHP), OPENGL, Blender 3D, MySQL, C, C++ and JAVA.</p>',
    'resume': '<a href="home.html" onclick="navigator.vibrate(40)"><img id="resume" src="assets/img/enter.png" alt="Enter" class="ico-img1"</a>',
	'aboutme': 'TEST</a>',
	'name': 'MARIOS</a>',
	'lastname': 'PENTELAS</a>',
  },
    'gr': {
      'intro': '<h1>Μάριος Πεντέλας</h1><h5>Σχεδιασμός ιστοσελίδων & Κατασκευή Εφαρμογών</h5>\
	  <p>Είμαι μαθητής σε Ινστιτούτο Επαγγελματικής Κατάστησης στην Θεσσαλονίκη.\
	  Αυτή την στιγμή σπουδάζω Κατασκευή ιστοσελιδών (PHP), OPENGL, Blender 3D, MySQL, C, C++ και JAVA.</p>',
    'resume': '<a href="homegr.html" onclick="navigator.vibrate(40)"><img id="resume" src="assets/img/entergr.png" alt="Enter" class="ico-img1"</a>',
	'aboutme': 'τέστ</a>',
  },
  };

  // Creating a translator instance
  var translator = new EOTranslator(dictionary);

  // Getting the DOM elements
  var globalTranslate = document.getElementById('globalTranslate');

  // Setting the default language
  globalTranslate.value = document.documentElement.lang || '';

  // Translating the greeting input when the greet button is clicked
  globalTranslate.addEventListener('change', function () {
    var language = globalTranslate.value;

    try {
      translator.translateDOM(document.body, language);
    } catch (e) {
      alert(e);
    }
  });

  // Invoking the change event
  globalTranslate.dispatchEvent(new Event('change'));
});

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
      'intro': '<h1>Marios Pentelas</h1><h5>Student at Computer Application Technician Department</h1>\
	  <p>I am student at an Institute of Vocational Training in Thessaloniki, Greece. \
	  I am currently studying Web development (PHP), OPENGL, Blender 3D, MySQL, C, C++ and JAVA.</p>',
    'resume': '<input class="resume" type="button" value="MY RESUME" onclick="home()">',
  },
    'gr': {
      'intro': '<h1>Μάριος Πεντέλας</h1><h5>Φοιτητής Τεχνικός Εφαρμογών Πληροφορικής Δ\' Εξάμηνο</h1>\
	  <p>Είμαι μαθητής σε Ινστιτούτο Επαγγελματικής Κατάρτησης στην Θεσσαλονίκη.\
	  Αυτή την στιγμή σπουδάζω Κατασκευή ιστοσελιδών (PHP), OPENGL, Blender 3D, MySQL, C, C++ και JAVA.</p>',
    'resume': '<input class="resume br" type="button" value="ΤΟ ΒΙΟΓΡΑΦΙΚΟ ΜΟΥ" onclick="homegr()">',
  },
  };

  // Creating a translator instance
  var translator = new EOTranslator(dictionary);

  // Getting the DOM elements
  var globalTranslate = document.getElementById('globalTranslate');

  // Setting the default language
  globalTranslate.value = document.documentElement.lang || 'gr';

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

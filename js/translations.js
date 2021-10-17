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
 
window.addEventListener('load', () => {

  // Creating a dictionary
  
  if (userLang.includes('el')) {
  var lang = 'gr';
  } 
  else if (userLang.includes('el-GR')) {
  var lang = 'gr';
  }
  else {
  var lang = 'en';
  }  
  
  var dictionary = {
    'en': {
      'intro': '<h1>Marios Pentelas</h1><h5>Graduate at Computer Application Technician Department</h1>\
	  <p>I have studied at a Vocational Training Institute in Thessaloniki, Greece, \
	  following courses such as web development (PHP, WordPress), MySQL, Adobe Premiere & Animate, Blender, OpenGL, C, C++ and JAVA.</p>',
    'resume': '<input class="resume" type="button" value="MY RESUME" onclick="home()">',
	'cookies': 'We use cookies for a better experience. <a class="policy" href="https://www.websitepolicies.com/policies/view/9uwk5kUA">Read more</a>.</span>',
	'cookiesaccept': 'I understand',
  },
    'gr': {
      'intro': '<h1>Μάριος Πεντέλας</h1><h5>Απόφοιτος ΙΕΚ στην ειδικότητα Τεχνικός Εφαρμογών Πληροφορικής</h1>\
	  <p>Έχω σπουδάσει σε Ινστιτούτο Επαγγελματικής Κατάρτισης στη Θεσσαλονίκη.\
	  Τα μαθήματα που ειδικεύτηκα περιλαμβάνουν κατασκευή ιστοσελίδων (PHP, WordPress), MySQL, Adobe Premiere & Animate, Blender, OpenGL, C, C++ και JAVA.</p>',
    'resume': '<input class="resume br" type="button" value="ΤΟ ΒΙΟΓΡΑΦΙΚΟ ΜΟΥ" onclick="homegr()">',
	'cookies': 'Χρησιμοποιούμε cookies για μια καλύτερη εμπειρία. <a class="policy" href="https://www.websitepolicies.com/policies/view/9uwk5kUA">Δείτε περισσότερα</a>.</span>',
	'cookiesaccept': 'Το κατάλαβα',
  },
  };

  // Creating a translator instance
  var translator = new EOTranslator(dictionary);

  // Getting the DOM elements
  var globalTranslate = document.getElementById('globalTranslate');

  // Setting the default language
  globalTranslate.value = document.documentElement.lang || lang ;

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

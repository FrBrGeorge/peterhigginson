<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
 <title>ARMlite Assembly Language Simulator by Peter Higginson</title>
 <meta name="copyright" content="&copy; 2020 Peter Higginson and Richard Pawson">
</head>
<body>
<h1>ARMlite Documentation</h1>
<p>ARMlite simulates a simple computer built around a cut-down version of a 32-bit ARM processor. It was extended from Peter's earlier simulators specifically to meet the needs of a book written by Richard Pawson. Richard's help in developing the simulator, particularly the graphics, is gratefully acknowledged.</p>
<h3>Releases</h3>
<p>The current default release (the one that got you here) is <a href="v1_2.html" target="_blank">ARMlite v1.2.0</a>.</p>
<p>This release has a more complete implementation of all the ARM shift instructions (<a href="ARMlite&#32;Experimental&#32;and&#32;Advanced&#32;Features.pdf" target="_blank">click for details</a>).</p>
<p>It also has a varying Program area width (depending on the browser window), aligning of comments and scaling of the binary mode display. See the "Simulation configuration" section of the <a href="Programming&#32;reference&#32;manual_v1_2.pdf" target="_blank">manual</a> to configure these features.</p>
<p>There are no changes to previously supported ARM instructions or their execution. The previous releases are still available using <a href="v1_1.html" target="_blank">for v1.1</a> and <a href="v1_0.html" target="_blank">for v1.0</a>.</p>
<h3>ARMlite Programming Reference Manual</h3>
<p>The features and assembly language supported by ARMlite are documented in the <a href="Programming&#32;reference&#32;manual_v1_2.pdf" target="_blank">ARMlite Programming Reference Manual</a>.</p>
<p>For instructions on how to use the simulator and set breakpoints see see page 8 of <a href="Assembly&#32;Language&#32;-&#32;Student&#32;version.pdf" target="_blank">Assembly Language Programming</a>.</p>
<h3>The Book</h3>
<p>Assembly Language Programming by Richard Pawson with Peter Higginson, is a textbook written specifically for teaching A-level. This is part of a series of books called "Computer Science from the Metal Up" by Richard and a description of these, with free download of the student versions available <a href="https://community.computingatschool.org.uk/resources/6172/single" target="_blank">using this link</a>.</p>
<p>There are also Teacher versions available including model answers to all exercises and additional Teacher Notes. These are available through the Computing At School forum, either from the above link, from <a href="https://community.computingatschool.org.uk/resources/6019/single" target="_blank">here</a> for the assembly language teacher notes or by emailing Richard Pawson (rpawson at metalup.org).</p>
<h3>The AQA Assembly Language</h3>
<p>Appendix I of the book explains the restrictions that need to be followed when using ARMlite to keep to instruction set used by the AQA in previous examinations. In particular the byte vs. word addressing issues need to be understood. A copy of just the Appendix is <a href="Appendix&#32;I.pdf" target="_blank">here</a>.</p>
<h3>Experimental and Advanced Features</h3>
<p>ARMlite has a number of other features to enable more advanced programs to be written. They are documented <a href="ARMlite&#32;Experimental&#32;and&#32;Advanced&#32;Features.pdf" target="_blank">here</a>.</p>
<h3>Bugs, Questions etc.</h3>
<p>Peter is more than happy to get email from anyone using ARMlite, whether reporting a bug, asking a question or just a comment. His email address is "plh256 at hotmail.com".</p>
<p></p>
<p>Peter and Richard 14/10/2020</p>
<script type="text/javascript">
  startIt();
  var _paq = _paq || [];
  _paq.push(["setDomains", ["*.peterhigginson.co.uk/ARMlite","*.peterhigginson.co.uk/ARMlite"]]);
  _paq.push(["disableCookies"]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="https://www.peterhigginson.co.uk/piwik/";
    _paq.push(['setTrackerUrl', u+'piwik.php']);
    _paq.push(['setSiteId', '5']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
  })();
</script>
<noscript><p><img src="https://www.peterhigginson.co.uk/piwik/piwik.php?idsite=5" style="border:0;" alt="" /></p></noscript>
</body>
</html>

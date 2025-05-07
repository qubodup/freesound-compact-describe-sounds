// ==UserScript==
// @name         Freesound Compact Describe Sounds
// @namespace    https://qubodup.github.io/
// @version      1.0
// @description  Display Freesound description blocks in a table layout
// @author       qubodup
// @match        https://freesound.org/home/describe/sounds/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

injectCSS(`
body > div.bw-page > div > div > div.col-12.no-paddings.v-spacing-5 > div > p,
.helptext,
.fut-category .text-grey,
.fut-tags .text-grey,
.fut-description .text-grey,
.fut-license .text-grey,
.fut-license h5,
.fut-sources .text-grey,
.fut-description label,
.fut-category label,
.fut-tags label,
.fut-pack label,
.fut-pack h5,
.fut-geo label,
.fut-geo h5,
.fut-sources div.text-light-grey,
.fut-sources h5,
.fut-tags h5
{
  display: none !important;
}
/* fullwidth (not enough, gotta force via js below) */
body > div.bw-page > div.container {
  width: 100% !improtant;
  max-width: none !important;
  margin: 0 !important;
}
.h-spacing-left-1 {
    margin: 0;
}
#edit_describe_form > div > div.col-lg-3.offset-lg-1.d-lg-block.display-none {
  margin: 0 !important;
}

/* clutter begone! */
.v-spacing-5,
.v-spacing-top-2 {
  margin: 0px !important;
}
div[id^=sound-player-],
td.fut-player > div > div > div > div.bw-player.bw-player--hover-interactions > div,
td.fut-player > div > div > div > div.bw-player.bw-player--hover-interactions > div > img {
  height: auto !important;
  width: auto !important;
  max-height: 150px;
  min-height: 100px;
  max-width: 200px;
}

/* explicit micro */
td.fut-explicit label {
  -ms-writing-mode: tb-rl;
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
}

/* explicit WARN */
table {
  background-color: #f4f4fa;
}
table tr:nth-child(2n), tr {
  background-color: transparent !important;
}
td.fut-explicit:has(label > input[type="checkbox"]:checked),
tr:has(td.fut-explicit label > input[type="checkbox"]:checked) td.fut-tags,
tr:has(td.fut-explicit label > input[type="checkbox"]:checked) td.fut-description
{
  background-color: pink;
}
table input, table textarea {
  background-color: white !important;
}

/* license rows */
td.fut-license > div > div,
td.fut-license b
{
  font-weight: normal !important;
  display: block !important;
}
.fut-license .col-md-4 {
  max-width: none !important;
}
.fut-license input {
  display: none !important;
}
/* by */

td.fut-explicit:has(label > input[type="checkbox"]:checked),
tr:has(td.fut-explicit label > input[type="checkbox"]:checked) td.fut-tags,
tr:has(td.fut-explicit label > input[type="checkbox"]:checked) td.fut-description
{
  background-color: pink;
}


td.fut-license:has(input[id$="-license_5"]:checked),
tr:has(td.fut-license input[id$="-license_5"]:checked) td.fut-pack,
tr:has(td.fut-license input[id$="-license_5"]:checked) td.fut-geo,
tr:has(td.fut-license input[id$="-license_5"]:checked) td.fut-sources
{
  background-color: PaleGreen;
}
/* nc */
td.fut-license:has(input[id$="-license_6"]:checked),
tr:has(td.fut-license input[id$="-license_6"]:checked) td.fut-pack,
tr:has(td.fut-license input[id$="-license_6"]:checked) td.fut-geo,
tr:has(td.fut-license input[id$="-license_6"]:checked) td.fut-sources
{
  background-color: Wheat;
}
/* cc0 */
td.fut-license:has(input[id$="-license_2"]:checked),
tr:has(td.fut-license input[id$="-license_2"]:checked) td.fut-pack,
tr:has(td.fut-license input[id$="-license_2"]:checked) td.fut-geo,
tr:has(td.fut-license input[id$="-license_2"]:checked) td.fut-sources
{
  background-color: LightSlateGray;
}
td.fut-license b span { display: block; }
td.fut-license { min-width: 40px; }
td.fut-license b { padding-top: 4px; margin-left: 4px; margin-right: 4px;}

/* up up up */
td { vertical-align: top; }

/* smol h1 */
body > div.bw-page > div > div > div.no-paddings.col-12.v-spacing-3 > h1 {
line-height: 1em;
font-weight: normal;
font-size: 100%;
}

/* too much v space, categories */
.line-height-50,
.fut-category {
  line-height: 1em !important;
}
div.bst-category-field { margin-top: 4px;}

div.bst-category-field:has(button.btn-primary) > div > button:not(.btn-primary) {
    background-color: #aaa;
    max-width: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

div.bst-category-field:has(button.btn-primary) > div > button:not(.btn-primary):hover,
div.bst-category-field div.subcategory-buttons:has(button.btn-primary) > div > button:not(.btn-primary):hover{
    overflow: visible;
}

div.bst-category-field div.subcategory-buttons:has(button.btn-primary) > div > button:not(.btn-primary) {
    background-color: #aaa;
    max-width: 30px;
    overflow: hidden;
    white-space: nowrap;
}

.tooltiptext {
  white-space: normal;
}

/* float navigation box */
.fut-nav {
  width: 20em;
  position: fixed !important;
  top: 0;
  right: 0;
  z-index: 9999;
  display: block !important;
  background: #ccc; /* Optional: for visibility */
  padding: 1em; /* Optional: add spacing */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); /* Optional: subtle shadow */
}
h2 {
  margin-bottom: .25em;
  max-width: 200px;
  font-size: 100%;
  font-weight: normal;
  line-height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

table button, table .btn-inverse, table .btn-primary {
  border-radius: 0 !important;
  padding: 3px 5px;
  font-weight: normal;
  margin: 1px 0;
}
table button, table .btn-inverse {
    background-color: white;
}

span:has(.bw-icon-close:hover) {
    background-color: grey;
}

span.bw-icon.bw-icon-copy { margin-left: 6px; }
span.bw-icon.bw-icon-copy,
span.bw-icon.bw-icon-close {
    border: 1px solid grey;
    margin-right: 6px;
    margin-left: 4px;
    padding: 2px;
    background-color: black;
    color: white;
    position: relative !important;
}
span.bw-icon.bw-icon-copy:hover,
span.bw-icon.bw-icon-close:hover {
    margin-right: 6px;
    padding: 2px;
    background-color: white;
    color: black
}
tr {
vertical-align: top; }
td {
    padding: 4px !important;
}

td.fut-license .bw-radio-container {
    display: none !important;
    background-color: red;
}
td.fut-license {
    text-align: center !important;
}
td.fut-license div {
    padding: 0;
}
td.fut-license b
{
    text-align: center !important;
    margin: 0;
}
td.fut-license b {
    background-color: #aaa;
}
td.fut-license b:hover {
    background-color: white;
}
td.fut-license label:has(input:checked) b {
  background-color: white;
}

/* tags */
div.tags-input-wrapper div {
    position: static !important;
}
div.tags-input-wrapper  input {
    border: 1px solid grey;
}
.tags-field span:hover {
    background-color: #ddd;
}
.double-tag {
  background-color: #ffcccc;
  border: 1px solid red;
}


td.fut-tags div.tags-input-wrapper {
    padding: 0;
    margin: 0;
}
.tags-field span {
    padding: 0px 3px;
    font-size: 85%;
}
.input-typeahead-suggestions {
    margin-top: 0px;
}
.v-spacing-top-3 {
    margin:0 !important;
}
/* name */
td.fut-name input {
    margin:0 !important;
    padding: 3px 4px !important;
}
/* description */
td.fut-description textarea {
    margin:0 !important;
}
td.fut-pack button{
    font-size: 85%;
}

`);

    const formBlocks = Array.from(document.querySelectorAll('div[id^="form-"]')).slice(0, 10);

    // force fullwidth, get navbar out of the way // not sure this is necessary, might have screwed up with css earlier and fixed now
    document.querySelector('body > div.bw-page > div.container').style.setProperty('max-width', 'none', 'important');
    const navBar = document.querySelector('#edit_describe_form > div > div.col-lg-3.offset-lg-1.d-lg-block.display-none');
    const mainContent = document.querySelector('#edit_describe_form > div > div.col-lg-8')
    mainContent.style.setProperty('display', 'block', 'important');
    mainContent.style.setProperty('flex', 'none', 'important');
    mainContent.style.setProperty('width', '100%', 'important');
    mainContent.style.setProperty('max-width', 'none', 'important');
    navBar.style.setProperty('display', 'block', 'important');
    navBar.style.setProperty('flex', 'none', 'important');
    navBar.style.setProperty('width', '100%', 'important');
    navBar.style.setProperty('max-width', 'none', 'important');
    // force fullwidth ... end

    formBlocks.forEach(form => {

        // Container table
        const table = document.createElement('table');

        const title = form.querySelector('h2');
        const playerToggle = form.querySelector('[data-target^="sound-player-"]')?.parentElement;
        const playerBlock = form.querySelector('.collapsable-block');
        playerBlock.classList.remove('collapsable-block-close');
        const category = form.querySelector('.bst-category-field')?.parentElement;
        const name = form.querySelector('input[name$="-name"]');
        const tags = form.querySelector('.tags-field')?.parentElement;
        const explicit = form.querySelector('label[for$=-is_explicit]');
        const description = form.querySelector('textarea[name$="-description"]')?.parentElement;
        const license = findFieldByLabelText(form, 'Sound license');
        const pack = findFieldByLabelText(form, 'Sound pack');
        const geo = form.querySelector('.geotag-field');
        const sources = findFieldByLabelText(form, 'Sound sources');

        // Row of Many Things
        const row1 = document.createElement('tr');

        // player
        var td = document.createElement('td');
        td.classList.add('fut-player');
        title.title = title.textContent;
        td.appendChild(title);
        td.appendChild(playerBlock);
        row1.appendChild(td);

        // name and category
        td = document.createElement('td');
        td.classList.add('fut-category');
        td.classList.add('fut-name');
        td.appendChild(name);
        td.appendChild(category);
        row1.appendChild(td);

        // tags
        td = document.createElement('td');
        td.classList.add('fut-tags');
        td.appendChild(tags);
        row1.appendChild(td);

        // START tag obesrver

        // tag counter / warnings
        tags.querySelectorAll('.tags-input-wrapper').forEach(wrapper => {
            // Create and insert counter element
            const counter = document.createElement('div');
            counter.className = 'tag-counter';
            wrapper.after(counter);

            const update = () => {
                console.log('HERE WE GO');
                const spans = Array.from(wrapper.querySelectorAll(':scope > span'));
                const seen = new Map();
                spans.forEach(span => {
                    const text = span.textContent.trim().toLowerCase();
                    if (seen.has(text)) {
                        span.classList.add('double-tag');
                        seen.get(text).classList.add('double-tag');
                    } else {
                        span.classList.remove('double-tag');
                        seen.set(text, span);
                    }
                });

                // Remove class from unique tags
                spans.forEach(span => {
                    const text = span.textContent.trim().toLowerCase();
                    if (spans.filter(s => s.textContent.trim().toLowerCase() === text).length === 1) {
                        span.classList.remove('double-tag');
                    }
                });

                counter.textContent = `${spans.length} tags`;
            };

            // Observe DOM changes to wrapper
            const observer = new MutationObserver(update);
            observer.observe(wrapper, { childList: true, subtree: false });

            // Initial count
            update();
        });

        // END tab obersver

        // explicit
        td = document.createElement('td');
        td.classList.add('fut-explicit');

        // explicit clutter cleanup
        const explicitLabel = explicit;
        const explicitLabelText = Array.from(explicitLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (explicitLabelText) explicitLabelText.textContent = ' explicit';

        // explicit continued
        td.appendChild(explicit);
        row1.appendChild(td);

        // Description
        td = document.createElement('td');
        td.classList.add('fut-description');
        td.appendChild(description);
        row1.appendChild(td);

        // license
        td = document.createElement('td');
        td.classList.add('fut-license');

        // license clutter cleanup
        license.querySelector('h5').textContent = 'License';
        const zeroButton = license.querySelector('b:has(span.bw-icon-zero)');
        const zeroButtonText = Array.from(zeroButton.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (zeroButtonText) zeroButtonText.textContent = 'CC0';
        const ncButton = license.querySelector('b:has(span.bw-icon-by-nc)');
        const ncButtonnText = Array.from(ncButton.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (ncButtonnText) ncButtonnText.textContent = 'NC';
        const byButton = license.querySelector('b:has(span.bw-icon-by)');
        const byButtonText = Array.from(byButton.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (byButtonText) byButtonText.textContent = 'BY';

        // license continued
        td.appendChild(license);
        row1.appendChild(td);

        // pack
        td = document.createElement('td');
        td.classList.add('fut-pack');
        td.appendChild(pack);
        row1.appendChild(td);

        // geo
        td = document.createElement('td');
        td.classList.add('fut-geo');

        // geo clutter cleanup
        const geoLabel = geo.querySelector('button.show-geolocation-button');
        const geoLabelText = Array.from(geoLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (geoLabelText) geoLabelText.textContent = 'Geo';

        // geo continued
        td.appendChild(geo);
        row1.appendChild(td);

        // sources
        td = document.createElement('td');
        td.classList.add('fut-sources');

        // sources button clutter cleanup
        const sourcesButton1 = sources.querySelector('button[data-toggle="add-sounds-modal"]');
        const sourcesButton1text = Array.from(sourcesButton1.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (sourcesButton1text) sourcesButton1text.textContent = 'Source';
        const sourcesButton2 = sources.querySelector('button:nth-of-type(2)');
        const sourcesButton2text = Array.from(sourcesButton2.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (sourcesButton2text) sourcesButton2text.textContent = 'Remove';

        // sources continued
        td.appendChild(sources);
        row1.appendChild(td);

        table.appendChild(row1);

        // Insert before original form to preserve scripts/events
        form.parentNode.insertBefore(table, form);
        form.style.display = 'none'; // Keep in DOM but hide original
    });

    function findFieldByLabelText(container, text) {
        const headings = Array.from(container.querySelectorAll('h5'));
        for (const heading of headings) {
            if (heading.textContent.trim().includes(text)) {
                return heading.parentElement;
            }
        }
        return null;
    }
})();

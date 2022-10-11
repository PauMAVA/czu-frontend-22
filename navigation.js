var nextChapter = () => {};
var previousChapter = () => {};
var nextSlide = () => {};
var previousSlide = () => {};
var firstSlide = () => {};
var firstChapter = () => {};

class Chapter {
    constructor(chapterElem, chapterName, numSlides) {
        this.chapterElem = chapterElem;
        this.chapterName = chapterName;
        this.numSlides = numSlides;
        this.currentSlide = 0;
    }

    getElem() {
        return this.chapterElem;
    }

    isAtStart() {
        return this.currentSlide === 0;
    }

    reset() {
        this.currentSlide = 0;
    }

    previousSlide() {
        if (this.currentSlide === 0) {
            return -1;
        }
        this.currentSlide--;
        return this.currentSlide;
    }

    nextSlide() {
        if (this.currentSlide >= this.numSlides - 1) {
            return -1;
        }
        this.currentSlide++;
        return this.currentSlide;
    }

    getChapterName() {
        return this.chapterName;
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getNumSlides() {
        return this.numSlides;
    }
}

jQuery(($) => {

    // Save the current chapter, the total number of chapters and the chapters themselves.
    let currentChapter = 0;
    let numChapters = 0;
    let chapters = [];

    let presentation = $("#presentation");

    $(".chapter").each((i, elem) => {
        let jElem = $(elem);
        let numSlides = jElem.find('section').length;
        let chapterTitleElem = jElem.find('h2');
        let chapterName = '';
        if (chapterTitleElem.length > 0) {
            chapterName = $(chapterTitleElem[0]).text();
        }
        chapters.push(new Chapter(jElem, chapterName, numSlides));
        numChapters++;
    });

    // Utility to translateX an element
    function translateX(element, value) {
        element.css('transform', 'translateX(' + value.toString() + 'vw)');
    }

    // Utility to translateY an element
    function translateY(element, value) {
        element.css('transform', 'translateY(' + value.toString() + 'vh)');
    }

    // Utility to un-focus buttons
    function blurIcons() {
        $(".icon").blur();
    }

    // Utility to update the chapter peek
    function updateInfo() {
        let chapter = chapters[currentChapter];
        $("#chapter_name").text(chapter.getChapterName());
        $("#current_slide").text(chapter.getCurrentSlide() + 1);
        $("#total_slides").text(chapter.getNumSlides());
    }

    // Functions that handle movement.
    nextChapter = () => {
        if (currentChapter >= numChapters - 1) {
            blurIcons();
            return;
        }
        let oldElem = chapters[currentChapter];
        currentChapter++;
        updateInfo();
        let needsTimeout = !oldElem.isAtStart();
        oldElem.reset();
        translateX(oldElem.getElem(), 0);
        setTimeout(() => {
            translateY(presentation, currentChapter * 100 * -1);
            blurIcons();
        }, needsTimeout ? 500 : 0);
    };

    previousChapter = () => {
        if (currentChapter === 0) {
            blurIcons();
            return;
        }
        let oldElem = chapters[currentChapter];
        currentChapter--;
        updateInfo();
        let needsTimeout = !oldElem.isAtStart();
        oldElem.reset();
        translateX(oldElem.getElem(), 0);
        setTimeout(() => {
            translateY(presentation, currentChapter * 100 * -1);
            blurIcons();
        }, needsTimeout ? 500 : 0);
    };

    nextSlide = () => {
        let chapter = chapters[currentChapter];
        let offset = chapter.nextSlide();
        updateInfo();
        if (offset === -1) {
            blurIcons();
            return;
        }
        translateX(chapter.getElem(), offset * 100 * -1);
        blurIcons();
    };

    previousSlide = () => {
        let chapter = chapters[currentChapter];
        let offset = chapter.previousSlide();
        updateInfo();
        if (offset === -1) {
            blurIcons();
            return;
        }
        translateX(chapter.getElem(), offset * 100 * -1);
        blurIcons();
    };

    firstSlide = () => {
        let chapter = chapters[currentChapter];
        chapter.reset();
        updateInfo();
        translateX(chapter.getElem(), 0);
        blurIcons();
    };

    firstChapter = () => {
        let oldChapter = chapters[currentChapter];
        let needsTimeout = !oldChapter.isAtStart();
        currentChapter = 0;
        oldChapter.reset();
        updateInfo();
        translateX(oldChapter.getElem(), 0);
        setTimeout(() => {
            translateY(presentation, 0);
            blurIcons();
        }, needsTimeout ? 500 : 0);
    };

    // Bind key actions to the movement actions
    const KEY_MAP = {
        37: previousSlide,   // 37 === KEY_DOWN
        39: nextSlide,       // 39 === KEY_RIGHT
        38: previousChapter, // 38 === KEY_UP
        40: nextChapter,     // 40 === KEY_DOWN
        72: firstSlide,      // 72 === KEY_H
        82: firstChapter,    // 82 === KEY_R
    }

    $(document).on('keydown', (e) => {
        let pressedCode = e.originalEvent.keyCode.toString();
        // If the pressed key has a bound action then stop the event propagation execute the action and cancel the event
        if (Object.keys(KEY_MAP).includes(pressedCode)) {
            e.stopImmediatePropagation();
            KEY_MAP[pressedCode]();
            return false;
        }
    });

    updateInfo();
    blurIcons();

});
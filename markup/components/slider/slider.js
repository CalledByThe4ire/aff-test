document.addEventListener('DOMContentLoaded', () => {
  const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve) => {
      const node = element;

      const classList = node.className;

      animation
        .split(' ')
        .forEach((className) => node.classList.add(`${prefix}animated`, `${prefix}${className}`));

      const handleAnimationEnd = () => {
        node.className = classList;
        node.removeEventListener('animationend', handleAnimationEnd);

        resolve('Animation ended');
      };

      node.addEventListener('animationend', handleAnimationEnd);
    });

  const getClassModifier = (element) => {
    let modifier = '';

    element.classList.forEach((className) => {
      if (element.className.includes('--')) {
        [, modifier] = className.split('--');
      }
    });

    return modifier;
  };

  const swapSliderSlides = (event, sliderClassName, slideClassName, controlName) => {
    const { target } = event;

    const slider = document.querySelector(`.${sliderClassName}`);

    const controls = slider.querySelectorAll(`.${controlName}`);

    controls.forEach((item) => {
      const control = item;

      control.disabled = true;
    });

    const modifier = getClassModifier(target.parentElement);

    const result = [];

    slider.querySelectorAll(`.${slideClassName}`).forEach(async (slide, index, array) => {
      if (index === 0) {
        result.push(slide);
        await animateCSS(slide, 'bounceOut slower');
        slide.classList.remove('slider__item--back');
        slide.classList.add('slider__item--front');
        target.disabled = false;
      }

      if (index === array.length - 1) {
        result.push(slide);

        switch (modifier) {
          case 'prev':
            await animateCSS(slide, 'bounceOutLeft slow');
            break;
          case 'next':
            await animateCSS(slide, 'bounceOutRight slow');

            break;
          default:
            throw new Error(`Unknown modifier: ${modifier}`);
        }

        slide.classList.remove('slider__item--front');
        slide.classList.add('slider__item--back');
        target.disabled = false;
      }

      controls.forEach((item) => {
        const control = item;

        control.disabled = false;
      });
    });

    const [first, last] = result;

    last.after(first);
  };

  document.querySelectorAll('.controls-slider > .controls-slider__item').forEach((control) =>
    control.addEventListener('click', (event) => {
      swapSliderSlides(event, 'slider', 'slider__item', 'controls-slider__btn');
    })
  );
});

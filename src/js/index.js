import '../styles/style.scss'

document.addEventListener('DOMContentLoaded', function () {
  loader()
  header()
  banner()
  formRegistry()
  popup()
  share()
  speakers()
})

function loader() {
  $('html').addClass('no-scroll')
  window.addEventListener('load', function () {
    $('.loader').fadeOut()
    $('html').removeClass('no-scroll')
  })
}

function banner() {
  const block = document.querySelector('.banner')
  if (block) {
    block.addEventListener('mousemove', bannerMegaphoneAnim)
    setInterval(function () { makeTimer() }, 1000)
  }

  window.addEventListener('load', function () {
    getWidthTimeleft()
    bannerBgAnim()
  })

  window.addEventListener('resize', getWidthTimeleft)
}

function bannerBgAnim() {
  const scrollingImage = document.querySelector('.banner__bg')

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      scrollingImage.classList.add('banner__bg--visible')
    }
  })
}

function bannerMegaphoneAnim(event) {
  const elements = document.querySelectorAll('.banner__megaphone img')
  const speed = 5
  for (const element of elements) {
    const x = (event.pageX * speed - window.innerWidth / 2) / 100
    const y = (event.pageY * speed - window.innerHeight / 2) / 100
    element.style.transform = `translateX(${x}px) translateY(${y}px)`
  }
}

function getWidthTimeleft() {
  const block = document.querySelector('.banner__timeleft')
  if (block) {
    block.style.minWidth = ''
    const width = block.offsetWidth
    block.style.minWidth = `${width}px`
  }
}

function makeTimer() {
  const timerBlock = document.querySelector('[data-timer]')
  if (timerBlock) {
    const endTime = (Date.parse(new Date(timerBlock.dataset.end))) / 1000
    const now = Date.parse(new Date().toLocaleString('en-US', { timeZone: 'Europe/Moscow' })) / 1000

    const timeLeft = endTime - now

    const days = Math.floor(timeLeft / 86400)
    let hours = Math.floor((timeLeft - (days * 86400)) / 3600)
    let minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60)
    let seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)))

    if (hours < '10') { hours = `0${hours}` }
    if (minutes < '10') { minutes = `0${minutes}` }
    if (seconds < '10') { seconds = `0${seconds}` }

    if (days > -1) {
      timerUpdateValues('days', days, ['день', 'дня', 'дней'])
      timerUpdateValues('hours', hours, ['час', 'часа', 'часов'])
      timerUpdateValues('minutes', minutes, ['минута', 'минуты', 'минут'])
      timerUpdateValues('seconds', seconds, ['секунда', 'секунды', 'секунд'])
    }
  }
}

function timerUpdateValues(id, item, descr) {
  const element = $(`[data-timer-${id}]`)
  element.html(`${item} ${decOfNumber(item, descr)}`)
}

function decOfNumber(number, titles) {
  const decCache = []
  const decCases = [2, 0, 1, 1, 1, 2]
  if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)]
  return titles[decCache[number]]
}

function formRegistry() {
  const block = document.querySelector('.form-registry')

  if (block) {
    const textElement = block.querySelector('.form-registry__text-anim')
    const text = textElement.textContent.trim()
    textElement.textContent = ''
    let index = 0

    // проверяем, виден ли элемент в области просмотра
    function isElementInViewport(element) {
      const rect = element.getBoundingClientRect()
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }

    // анимация текста
    function typeWriter() {
      if (index < text.length) {
        textElement.textContent += text.charAt(index)
        index++
        setTimeout(typeWriter, 150)
      }
    }

    function handleScroll() {
      if (isElementInViewport(textElement)) {
        typeWriter()
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)
  }
}

function header() {
  const block = $('.header')
  const burgerButton = $('.header__burger-button')
  const burgerButtonClassActive = 'header__burger-button--active'

  window.openBurgerMenu = () => {
    $('.header').addClass('header--burger')
    $('html').addClass('no-scroll')
    burgerButton.addClass(burgerButtonClassActive)
  }

  window.closeBurgerMenu = () => {
    $('.header').removeClass('header--burger')
    burgerButton.removeClass(burgerButtonClassActive)
    $('html').removeClass('no-scroll')
  }

  burgerButton.on('click', function () {
    if ($(this).hasClass(burgerButtonClassActive)) {
      window.closeBurgerMenu()
    } else {
      window.openBurgerMenu()
    }
  })

  headerHeight()
  $(window).on('load', headerHeight)
  $(window).on('resize', headerHeight)

  window.addEventListener('scroll', function () {
    window.scrollY > 100 ? $(block).addClass('header--scroll') : $(block).removeClass('header--scroll')
  })
}

function headerHeight() {
  const blockHeight = $('.header').outerHeight(true)
  $('html').css('--header-height', `${blockHeight}px`)
}

function share() {
  window.shareButtonCopy = shareButtonCopy
}

function shareButtonCopy(element) {
  const valueToCopy = $(element).data('copy-value')

  const temporaryInput = $('<input>')
  temporaryInput.css({ display: 'absolute', left: '-1000px', top: '-1000px' })
  temporaryInput.val(valueToCopy)
  $('body').append(temporaryInput)
  temporaryInput.select()
  document.execCommand('copy')
  temporaryInput.remove()

  $(element).addClass('share__button--active')
}

function speakers() {
  const blocks = document.querySelectorAll('.speakers')
  if (blocks.length > 0) {
    for (const block of blocks) {
      const slider = block.querySelector('.swiper')
      const pagination = block.querySelector('.swiper-pagination')
      const paginationWrapper = block.querySelector('.ui-swiper-pagination')
      const lockedClass = 'ui-swiper-pagination--locked'
      const swiper = new Swiper(slider, {
        slidesPerView: 'auto',
        spaceBetween: 18,
        pagination: {
          el: pagination,
          clickable: true
        },
        breakpoints: {
          767: {
            slidesPerView: 'auto',
            spaceBetween: 40
          },
          1259: {
            slidesPerView: 4,
            spaceBetween: 58
          }
        },
        on: {
          progress: function (swiper) {
            swiper.isLocked ? paginationWrapper.classList.add(lockedClass) : paginationWrapper.classList.remove(lockedClass)
          }
        }
      })
    }
  }
}

function popup() {
  window.openPopup = function (element) {
    const popupElement = $(element)
    if (popupElement) {
      popupElement.addClass('active')
      $('html').css('overflow', 'hidden')
    }
  }

  window.closePopup = function (element) {
    $(element).removeClass('active')
    $('html').css('overflow', '')
  }

  $('.popup').on('click', function (event) {
    if ($(event.target).closest('.popup__container').length === 0) {
      $(this).removeClass('active')
      $('html').css('overflow', '')
    }
  })
}

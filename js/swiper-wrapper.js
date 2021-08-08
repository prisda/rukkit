(
	function( $ ) {
		'use strict';

		$.fn.BilleySwiper = function( options ) {
			var defaults = {};
			var settings = $.extend( {}, defaults, options );

			var $swiper;

			this.each( function() {
				var $slider = $( this );
				var $sliderInner = $slider.children( '.swiper-inner' ).first();
				var sliderSettings = $slider.data();

				var $sliderContainer = $sliderInner.children( '.swiper-container' ).first(),
				    lgItems          = sliderSettings.lgItems ? sliderSettings.lgItems : 1,
				    mdItems          = sliderSettings.mdItems ? sliderSettings.mdItems : lgItems,
				    smItems          = sliderSettings.smItems ? sliderSettings.smItems : mdItems,
				    lgGutter         = sliderSettings.lgGutter ? sliderSettings.lgGutter : 0,
				    mdGutter         = sliderSettings.mdGutter ? sliderSettings.mdGutter : lgGutter,
				    smGutter         = sliderSettings.smGutter ? sliderSettings.smGutter : mdGutter,
				    speed            = sliderSettings.speed ? sliderSettings.speed : 1000;

				// Normalize slide per view, reset fake view to exist view.
				lgItems = 'auto-fixed' === lgItems ? 'auto' : lgItems;
				mdItems = 'auto-fixed' === mdItems ? 'auto' : mdItems;
				smItems = 'auto-fixed' === smItems ? 'auto' : smItems;

				var swiperOptions = $.extend( {}, {
					init: false,
					slidesPerView: smItems,
					spaceBetween: smGutter,
					speed: speed,
					breakpoints: {
						// when window width is >=
						767: {
							slidesPerView: mdItems,
							spaceBetween: mdGutter
						},
						1024: {
							slidesPerView: lgItems,
							spaceBetween: lgGutter
						}
					}
				}, settings );

				if ( sliderSettings.slidesPerGroup == 'inherit' ) {
					swiperOptions.slidesPerGroup = smItems;

					swiperOptions.breakpoints[ 767 ].slidesPerGroup = mdItems;
					swiperOptions.breakpoints[ 1024 ].slidesPerGroup = lgItems;
				}

				swiperOptions.watchOverflow = true;

				if ( sliderSettings.slideColumns ) {
					swiperOptions.slidesPerColumn = sliderSettings.slideColumns;
				}

				if ( sliderSettings.initialSlide ) {
					swiperOptions.initialSlide = sliderSettings.initialSlide;
				}

				if ( sliderSettings.autoHeight ) {
					swiperOptions.autoHeight = true;
				}

				if ( typeof sliderSettings.simulateTouch !== 'undefined' && ! sliderSettings.simulateTouch ) {
					swiperOptions.simulateTouch = false;
				}

				// Maybe: fade, flip
				if ( sliderSettings.effect ) {
					swiperOptions.effect = sliderSettings.effect;

					if ( 'custom' === sliderSettings.fadeEffect ) {
						swiperOptions.fadeEffect = {
							crossFade: false
						};
					} else {
						swiperOptions.fadeEffect = {
							crossFade: true
						};
					}
				}

				if ( sliderSettings.loop ) {
					swiperOptions.loop = true;

					if ( sliderSettings.loopedSlides ) {
						swiperOptions.loopedSlides = sliderSettings.loopedSlides;
					}
				}

				if ( sliderSettings.centered ) {
					swiperOptions.centeredSlides = true;
				}

				if ( sliderSettings.autoplay ) {
					swiperOptions.autoplay = {
						delay: sliderSettings.autoplay,
						disableOnInteraction: false
					};
				}

				if ( sliderSettings.freeMode ) {
					swiperOptions.freeMode = true;
				}

				var $wrapControls;

				if ( sliderSettings.wrapControls ) {
					var $wrapControlsWrap = $( '<div class="swiper-controls-wrap"></div>' );
					$wrapControls = $( '<div class="swiper-controls"></div>' );

					$wrapControlsWrap.append( $wrapControls );
					$slider.append( $wrapControlsWrap );
				}

				if ( sliderSettings.nav ) {

					if ( sliderSettings.customNav && sliderSettings.customNav !== '' ) {
						var $customBtn = $( '#' + sliderSettings.customNav );
						var $swiperPrev = $customBtn.find( '.slider-prev-btn' );
						var $swiperNext = $customBtn.find( '.slider-next-btn' );
					} else {
						var $swiperPrev = $( '<div class="swiper-nav-button swiper-button-prev"><i class="nav-button-icon"></i><span class="nav-button-text">' + $billeySwiper.prevText + '</span></div>' );
						var $swiperNext = $( '<div class="swiper-nav-button swiper-button-next"><i class="nav-button-icon"></i><span class="nav-button-text">' + $billeySwiper.nextText + '</span></div>' );

						var $swiperNavButtons = $( '<div class="swiper-nav-buttons"></div>' );
						$swiperNavButtons.append( $swiperPrev ).append( $swiperNext );

						var $swiperNavButtonsWrap = $( '<div class="swiper-nav-buttons-wrap"></div>' );

						if ( 'grid' == sliderSettings.navAlignedBy ) {
							$swiperNavButtonsWrap.append( '<div class="container"><div class="row"><div class="col-sm-12"></div></div></div>' );
							$swiperNavButtonsWrap.find( '.col-sm-12' ).append( $swiperNavButtons );
						} else {
							$swiperNavButtonsWrap.append( $swiperNavButtons );
						}

						if ( $wrapControls ) {
							$wrapControls.append( $swiperNavButtonsWrap );
						} else {
							$sliderInner.append( $swiperNavButtonsWrap );
						}
					}

					swiperOptions.navigation = {
						nextEl: $swiperNext,
						prevEl: $swiperPrev
					};
				}

				if ( sliderSettings.pagination ) {
					var $swiperPaginationWrap = $( '<div class="swiper-pagination-wrap"><div class="swiper-pagination-inner"></div></div>' );
					var $swiperPagination = $( '<div class="swiper-pagination"></div>' );

					$swiperPaginationWrap.find( '.swiper-pagination-inner' ).append( $swiperPagination );

					if ( $wrapControls ) {
						$wrapControls.append( $swiperPaginationWrap );
					} else {
						$slider.append( $swiperPaginationWrap );
					}

					var paginationType = 'bullets';

					if ( sliderSettings.paginationType ) {
						paginationType = sliderSettings.paginationType;
					}

					swiperOptions.pagination = {
						el: $swiperPagination,
						type: paginationType,
						clickable: true
					};

					if ( $slider.hasClass( 'pagination-style-04' ) ) {
						var $swiperAltArrows = $( '<div class="swiper-alt-arrow-button swiper-alt-arrow-prev" data-action="prev"></div><div class="swiper-alt-arrow-button swiper-alt-arrow-next" data-action="next"></div>' );

						$swiperPaginationWrap.find( '.swiper-pagination-inner' ).append( $swiperAltArrows );

						swiperOptions.pagination.renderCustom = function( swiper, current, total ) {
							// Convert to string.
							var currentStr = current.toString();
							var totalStr = total.toString();

							return '<div class="fraction"><div class="current">' + currentStr + '</div><div class="separator">/</div><div class="total">' + totalStr + '</div></div>';
						};
					} else if ( $slider.hasClass( 'pagination-style-03' ) || $slider.hasClass( 'pagination-style-07' ) ) {
						swiperOptions.pagination.renderCustom = function( swiper, current, total ) {
							// Convert to string.
							var currentStr = current.toString();
							var totalStr = total.toString();

							// Add leading 0.
							currentStr = currentStr.padStart( 2, '0' );
							totalStr = totalStr.padStart( 2, '0' );

							return '<div class="fraction"><div class="current">' + currentStr + '</div><div class="separator"></div><div class="total">' + totalStr + '</div></div>';
						};
					} else if ( $slider.hasClass( 'pagination-style-06' ) ) {
						var $swiperAltArrows = $( '<div class="swiper-alt-arrow-button swiper-alt-arrow-next" data-action="next"></div>' );

						$swiperPaginationWrap.find( '.swiper-pagination-inner' ).append( $swiperAltArrows );

						swiperOptions.pagination.renderCustom = function( swiper, current, total ) {
							var width = (
								            100 / total
							            ) * current;

							width = width.toFixed( 0 );

							if ( swiper.prevProgressBarWidth === undefined ) {
								swiper.prevProgressBarWidth = width + '%';
							}

							// Convert to string.
							var currentStr = current.toString();
							var totalStr = total.toString();


							var fractionTemplate = '<div class="fraction"><span class="current">' + currentStr + '</span>' + '<span class="separator"> ' + $billeySwiper.fractionSeparatorText + ' </span>' + '<span class="total">' + totalStr + '</span></div>';

							return fractionTemplate + '<div class="progressbar"><div class="filled" data-width="' + width + '" style="width: ' + swiper.prevProgressBarWidth + '"></div></div>';
						};
					}
				}

				if ( sliderSettings.scrollbar ) {
					var $scrollbar = $( '<div class="swiper-scrollbar"></div>' );
					$sliderContainer.prepend( $scrollbar );

					swiperOptions.scrollbar = {
						el: $scrollbar,
						draggable: true,
					};

					swiperOptions.loop = false;
				}

				if ( sliderSettings.mousewheel ) {
					swiperOptions.mousewheel = {
						enabled: true
					};
				}

				if ( sliderSettings.vertical ) {
					swiperOptions.direction = 'vertical';
				}

				if ( sliderSettings.slideToClickedSlide ) {
					swiperOptions.slideToClickedSlide = true;
					swiperOptions.touchRatio = 0.2;
				}

				$swiper = new Swiper( $sliderContainer, swiperOptions );

				if ( sliderSettings.layerTransition ) {
					$swiper.on( 'init', function() {
						var index = $swiper.activeIndex;
						var slides = $swiper.$wrapperEl.find( '.swiper-slide' );
						var currentSlide = slides.eq( index );
						currentSlide.addClass( 'animated' );
					} );

					$swiper.on( 'slideChangeTransitionEnd', function() {
						var index = $swiper.activeIndex;
						var slides = $swiper.$wrapperEl.find( '.swiper-slide' );
						var currentSlide = slides.eq( index );
						currentSlide.addClass( 'animated' );
					} );

					$swiper.on( 'slideChangeTransitionStart', function() {
						var slides = $swiper.$wrapperEl.find( '.swiper-slide' );
						slides.removeClass( 'animated' );
					} );
				}

				$swiper.init();

				if ( sliderSettings.reinitOnResize ) {
					var resizeTimer;
					$( window ).on( 'resize', function() {
						clearTimeout( resizeTimer );

						resizeTimer = setTimeout( function() {
							$swiper.destroy( true, true );

							$swiper = new Swiper( $sliderContainer, swiperOptions );
						}, 300 );
					} );
				}

				// Handler custom nav clicked.
				if ( $slider.hasClass( 'pagination-style-04' ) || $slider.hasClass( 'pagination-style-06' ) ) {
					$slider.on( 'click', '.swiper-alt-arrow-button', function() {
						var action = $( this ).data( 'action' );

						switch ( action ) {
							case 'prev' :
								$swiper.slidePrev();
								break;
							case 'next' :
								$swiper.slideNext();
								break;
						}
					} );
				}

				// Update progress bar status.
				if ( $swiperPagination && $slider.hasClass( 'pagination-style-06' ) ) {
					$swiper.on( 'slideChangeTransitionStart', function( swiper ) {
						var $filled = $swiperPagination.find( '.filled' );
						var w = $filled.data( 'width' ) + '%';

						/**
						 * Transition from 0 instead of from end.
						 */
						if ( 0 === $swiper.realIndex && this.prevProgressBarWidth === '100%' ) {
							$filled.css( {
								width: 0
							} );
						}

						$filled.animate( {
							width: w
						}, 300 );

						this.prevProgressBarWidth = w;
					} );
				}

				// Disabled auto play when focus.
				if ( sliderSettings.pauseOnHover ) {
					$sliderContainer.on( 'mouseenter', function() {
						$swiper.autoplay.stop();
					} ).on( 'mouseleave', function() {
						$swiper.autoplay.start();
					} );
				}

				$( document ).trigger( 'BilleySwiperInit', [ $swiper, $slider, swiperOptions ] );
			} );

			return $swiper;
		};
	}( jQuery )
);

/*This file was exported by "Export WP Page to Static HTML" plugin which created by ReCorp (https://myrecorp.com) */
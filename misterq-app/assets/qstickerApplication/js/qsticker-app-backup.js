var qSticker = (function($) {
    var currentWindow = 0,
        sendPath = "",
        mainCallback,
        $window = [], 
        loader = (function($) {
            return {
                load: function(url, callback) {
                    $.ajax({
                      url: url,
                      success: callback
                    });
                }
            }
        })($),
        productImageMaxSizes = {
            width: 410,
            height: 480
        },
        applicationPath = "/",
        mainPictures = [
            'img/content/button-close.png',
            'img/content/button-expand.png',
            'img/content/button-rotate.png',

            'img/content/graphy.png',

            'img/content/hint-chooseColor.png',
            'img/content/hint-chooseGadget.png',
            'img/content/hint-chooseType.png',

            'img/content/hint-dragPictureLeft.png',
            'img/content/hint-dragPictureRight.png',
            'img/content/hint-dragPicture.png',

            'img/content/hint-uploadPicture.png',

            'img/content/membrane.png',
            
            'img/content/priceTag.png',
            'img/content/priceTag-big.png',
            
            'img/content/iphone4/phone-iphone4.png',
            'img/content/iphone4/case/iphone4-case-back.png',
            'img/content/iphone4/case/iphone4-case-back-contour.png',
            'img/content/iphone4/case/iphone4-case-back-mask.png',
            'img/content/iphone4/case/iphone4-case-back-mask-up.png',
            'img/content/iphone4/sticker/iphone4-sticker-back.png',
            'img/content/iphone4/sticker/iphone4-sticker-back-contour.png',
            'img/content/iphone4/sticker/iphone4-sticker-back-mask.png',
            'img/content/iphone4/sticker/iphone4-sticker-back-up.png',
            'img/content/iphone4/sticker/iphone4-sticker-front.png',
            'img/content/iphone4/sticker/iphone4-sticker-front-mask.png',
            'img/content/iphone4/sticker/iphone4-sticker-front-up.png',
            
            'img/content/iphone5/phone-iphone5.png',
            'img/content/iphone5/case/iphone5-case-back.png',
            'img/content/iphone5/case/iphone5-case-back-contour.png',
            'img/content/iphone5/case/iphone5-case-back-mask.png',
            'img/content/iphone5/case/iphone5-case-back-mask-up.png',
            'img/content/iphone5/sticker/iphone5-sticker-back.png',
            'img/content/iphone5/sticker/iphone5-sticker-back-contour.png',
            'img/content/iphone5/sticker/iphone5-sticker-back-mask.png',
            'img/content/iphone5/sticker/iphone5-sticker-back-up.png',
            'img/content/iphone5/sticker/iphone5-sticker-front.png',
            'img/content/iphone5/sticker/iphone5-sticker-front-mask.png',
            'img/content/iphone5/sticker/iphone5-sticker-front-up.png'
        ];

    function showPreload($parent) {
        var $preloadSplash = $('<div class="splash splashPreload">' +
            '<div class="last-caption">' +
            '<h4><span><div id="circleG">' +
            '<div id="circleG_1" class="circleG"></div>' +
            '<div id="circleG_2" class="circleG"></div>' +
            '<div id="circleG_3" class="circleG"></div>' +
            '</div>' +
            'Пожалуйста подождите, приложение загружается</span></h4>'+
            '</div>' +
            '</div>');

        $($preloadSplash).appendTo($parent).show();
    }

    function hidePreload($parent) {
        $parent.find('.splashPreload').fadeOut(150, function() {
            $(this).remove();
        });
    }

    function buildView($parent, model) {
        var startProductList = (function($) {
                var $productList = {};
                
                function buildView($parent, model) {
                    $productList = $('<ul class="products inline"></ul>');

                    $.each(model, function(index, value) {
                        $productList.append(
                            '<li>' +
                                '<img alt="' + value.title + '" style="width: 110px; height: 190px;" src="' + applicationPath + value.image + '">' +
                                '<h4>' + value.title + '</h4>' +
                            '</li>'
                        )
                    })
                    
                    $parent.append('<div class="help-gadget clearfix"></div>');
                    $parent.append($productList);
                }
                
                function addEventLisners() {
                    $productList.find('li').each(function(index, value) {
                        $(value).on('click', function(event) {
                            event.preventDefault();
                            qSticker.event.trigger('startProductList:selectItem', index);
                        })
                    })
                }
                
                return {
                    init: function($parent, model) {
                        buildView($parent, model);
                        addEventLisners();
                    }
                }
            })($),
            editPanelTools = (function($) {
                var $panelTools = {},
                    $gadgets = {},
                    $types = {},
                    activeGadget = 2,
                    activeType = 2;

                function buildView($parent, model) {
                    $panelTools = $('<div class="panel-tools" style="position: relative"></div>');
                    $gadgets = $('<ul class="nav nav-list gadgetTool"></ul>');
                    $types = $('<ul class="nav nav-list typeTool"></ul>');
                    
                    $.each(model, function(index, value) {
                        $gadgets.append(
                            '<li data-id="' + value.id +'">' +
                                '<a href="#">' + value.title +'</a>' +
                            '</li>'
                        )
                    })

                    $.each(model[0].types, function(index, value) {
                        $types.append(
                            '<li data-id="' + value.id +'">' +
                                '<a href="#">' + value.title +'</a>' +
                            '</li>'
                        )
                    })
                    
                    $panelTools.append('<h4>Гаджет</h4>');
                    $panelTools.append($gadgets);
                    
                    $panelTools.append('<h4>Тип защиты</h4>');
                    $panelTools.append($types);
                    
                    $panelTools.append('<h4>Цвет</h4>');
                    $panelTools.append('<div class="colorpicker cp-qSticker"></div>')
                    ColorPicker($panelTools.find('.colorpicker').get(0), function (a, b, rgb) {
                        qSticker.event.trigger('colorPicker:colorSelect', rgb);
                    }).setHex('#ffffff');   
                    
                    $parent.append($panelTools);
                }
                
                function addEventLisners() {
                    $gadgets.find('li').each(function(index, value) {
                        $(value).on('click', function(event) {
                            event.preventDefault();
                            $gadgets.find('li').removeClass('active');
                            $(event.currentTarget).addClass('active');

                            if(activeGadget != index) {
                                activeGadget = index;

                                qSticker.event.trigger('editPanelTools:selectValue', {activeGadget: activeGadget, activeType: activeType});
                            }
                        })
                    })
                    
                    $types.find('li').each(function(index, value) {
                        $(value).on('click', function(event) {
                            $types.find('li').removeClass('active');
                            $(event.currentTarget).addClass('active');
                            
                            if(activeType != index) {
                                activeType = index;
                                
                                qSticker.event.trigger('editPanelTools:selectValue', {activeGadget: activeGadget, activeType: activeType});
                            }
                        })
                    })
                    
                    qSticker.event.on('startProductList:selectItem', function(event, id) {                   
                        activeGadget = id,
                        activeType = 0;
                        
                        $gadgets.find('li').each(function(index, value) {
                            if(id === index) {
                                $(this).addClass('active');
                            }
                        })
                        
                        $types.find('li').each(function(index, value) {
                            if(0 === index) {
                                $(this).addClass('active');
                            }
                        })
                        
                        qSticker.event.trigger('editPanelTools:selectValue', {activeGadget: activeGadget, activeType: activeType});
                    }) 
                }
                
                return {
                    init: function($parent, model) {
                        buildView($parent, model);
                        addEventLisners();
                    }
                }
            })($),
            editImageList = (function($) {
                var $imageList = {};
                
                window.images = [];
                
                function buildView($parent) {
                    $imageList = $('<div class="panel-images">' +                           
                                        '<div class="images-list">' +
                                            '<input type="file" name="uploadImage" multiple="multiple" accept="image/*" class="openImage" style="display: none">' +   
                                            '<div class="images-list-add" href="#loadImgModal" role="button" class="btn" data-toggle="modal">' +
                                                '<label>Загрузить изображение</label>' +
                                            '</div>' +
                                            '<div class="slider">' +
                                                '<div class="arrow arrow-left btn btn-mini"><i class="icon icon-chevron-left"></i></div>' +
                                                '<div class="slider-body">' +
                                                    '<div class="contents"></div>' +
                                                '</div>' +
                                                '<div class="arrow arrow-right btn btn-mini"><i class="icon icon-chevron-right"></i></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>');
                    
                    $imageList.find('.slider').append();;
                    $parent.append($imageList);
                }
                
                function addEventLisners() {
                    function render() {
                        $imageList.find('.contents').empty();
                        
                        window.images.map(function (image, id) {
                            var $img = $('<div class="set-img" draggable="true" style="background-image: url(' + image + ')"><div class="delete"></div></div>')
                                .appendTo($imageList.find('.contents'))
                                .on('dblclick', function () {
                                    qSticker.event.trigger('editImageList:imageSelect', window.images[id]);
                                }).on('dragstart', function(event) {
                                    event.originalEvent.dataTransfer.setData("imageSrc", window.images[id]);
                                });
                            
                            $img.find('.delete').one('click', function () {
                                qSticker.event.trigger('editImageList:imageRemove', id);
                            })
                        })
                        
                        $imageList.find('.contents').css('width', $imageList.find('.contents').children().length * 110);
                    }
                    
                    $(window).on('dragover dragleave drop', function (event) {
                        event.preventDefault();
                        return false;
                    });
                    
                    $('.window-edit').on('dragover dragleave', function (event) {
                        event.preventDefault();
                        return false;
                    }).on('drop', function (event) {                        
                        event.preventDefault();
                        var files = event.originalEvent.dataTransfer.files;

                        $.each(files, function (index, file) {
                            if(file.type.indexOf("image") == 0) {
                                if (file.size <= 5*1024*1024) {
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (event) {
                                        qSticker.event.trigger('editImageList:imageLoad', event.currentTarget.result);
                                    };
                                    
                                    reader.readAsDataURL(file);
                                } else {
                                    //$e.trigger('ajaxError', {errors: ['file_too_large']})
                                }
                            }
                        });
                    });
                    
                    $('.modal-drop-img').on('dragover dragleave', function (event) {
                        event.preventDefault();
                        return false;
                    }).on('drop', function (event) {                        
                        event.preventDefault();
                        var files = event.originalEvent.dataTransfer.files;

                        $.each(files, function (index, file) {
                            if(file.type.indexOf("image") == 0) {
                                if (file.size <= 5*1024*1024) {
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (event) {
                                        $('#loadImgModal').on('hidden', function(){
                                            qSticker.event.trigger('editImageList:imageLoad', event.currentTarget.result);
                                        })
                                        
                                        $('#loadImgModal').find('.delete').trigger('click');                                        
                                    };
                                    
                                    reader.readAsDataURL(file);
                                } else {
                                    //$e.trigger('ajaxError', {errors: ['file_too_large']})
                                }
                            }
                        });
                    });
                    
                    $('.modal-add-img').on('click', function() {
                        $('.openImage').trigger('click');
                    })
                    
                    $('.openImage').on('change', function(event) {
                        var files = event.target.files;
                        
                        $('.openImage').replaceWith($('.openImage').clone(true));
                        
                        $.each(files, function (index, file) {
                            
                            if(file.type.indexOf("image") == 0) {
                                if (file.size <= 5*1024*1024) {
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (event) {
                                        qSticker.event.trigger('editImageList:imageLoad', event.currentTarget.result);
                                        
                                        $('#loadImgModal').find('.delete').trigger('click');                                        
                                    };

                                    reader.readAsDataURL(file);
                                } else {
                                    //$e.trigger('ajaxError', {errors: ['file_too_large']})
                                }
                            }
                        });
                    })
                    
                    qSticker.event.on('editImageList:imageLoad', function(event, src) {
                        window.images.push(src);

                        render();
                        
                        if(window.images.length == 1) {
                            qSticker.event.trigger('editImageList:addFirstImage');
                        }
                    })
                    
                    qSticker.event.on('editImageList:imageRemove', function(event, id) {
                        window.images.splice(id, 1);
                        render();
                        
                        if(window.images.length == 0) {
                            qSticker.event.trigger('editImageList:removeLastImage');
                        }
                    })
                    
                    qSticker.event.on('editImageList:addFirstImage', function(event) {
                        $imageList.find('.images-list-add').addClass('short').find('label').text('Загрузить еще изображение');
                        $imageList.find('.slider').show();
                    })
                    
                    qSticker.event.on('editImageList:removeLastImage', function(event) {
                        $imageList.find('.images-list-add').removeClass('short').find('label').text('Загрузить изображение');
                        $imageList.find('.slider').hide();
                    })
                    
                    $imageList.find('.arrow-right').on('click', function(event) {
                        var step = 110;
                        var bodyWidth = $imageList.find('.slider-body').width(),
                            bodyLeft = $imageList.find('.slider-body').offset().left,
                            contentWidth = $imageList.find('.contents').width(),
                            contentLeft = $imageList.find('.contents').offset().left;
                        
                        
                        if(contentLeft + contentWidth > bodyLeft + bodyWidth) {
                            $imageList.find('.contents').animate({left: contentLeft - bodyLeft - Math.min(step, contentLeft + contentWidth - bodyLeft - bodyWidth)}, 300);
                        }
                    });
                    
                    $imageList.find('.arrow-left').on('click', function() {
                        var step = 110;
                        var bodyLeft = $imageList.find('.slider-body').offset().left,
                            contentLeft = $imageList.find('.contents').offset().left;
                        
                        if(bodyLeft > contentLeft) {
                            $imageList.find('.contents').animate({left: contentLeft - bodyLeft + Math.min(step, bodyLeft - contentLeft)}, 300);
                        }
                    });
                }
                
                return {
                    init: function($parent) {
                        buildView($parent);
                        addEventLisners();
                    }
                }
            })($),
            editCustomizer = (function($) {
                var $customizer = {},
                    //$imageFrame = {},
                    $caseCanvas = {},
                    $stickerCanvas = {},
                    caseCustomizer,
                    stickerCustomizerFront,
                    stickerCustomizerBack,
                    dataModel,
                    currentType = -1,
                    currentGadget = -1;
                
                function Canvas(width, height){
                    var canvas = document.createElement('canvas');
                    
                    if (width) {
                        canvas.width = width;
                    }
                    
                    if (height) {
                        canvas.height = height;
                    }
                    
                    return canvas
                }
                
                function Customizer($parent, width, height, wrapClass, caption, isBack) {
                    var image = undefined,
                        imagesMs = [],
                        color = 'rgb(255, 255, 255)',
                        position = {
                            x: 0,
                            y: 0
                        },
                        canImageFrameAnimate = true,
                        rotation = 0,
                        zoom = 1,
                        max_zoom = 1,
                        grid,
                        canvas,
                        context,
                        temp_canvas,
                        temp_context,
                        data_length,
                        image_canvas,
                        image_context,
                        upOverlay,
                        $customizer,
                        $imageFrame,
                        $imageContour,
                        viewZoom = 1,
                        contour,
                        
                        BORDER_WIDTH = 1,
                        maskData;

                    
                    var grid_image = new Image();  
                    grid_image.onload = function () {
                        grid = grid_image;
                        
                        update();
                    };
                    grid_image.src = applicationPath + 'img/content/graphy.png';

                    $customizer = $('<div class="customizer ' + wrapClass + '" style="width:' + width + 'px; height:' + height + 'px">' +
                                        '<h5 class="caption">' + caption + '</h5>' +
                                        '<div class="zoom">' +
                                            '<button class="btn btn-mini btn-block minus"><i class="icon-minus"></i></button>' +
                                            '<button class="btn btn-mini btn-block plus"><i class="icon-plus"></i></button>' +
                                        '</div>' +
                                        '<canvas width="' + width + 'px" height="' + height + 'px"></canvas>' +
                                        '<div class="image-contour"></div>' +
                                    '</div>');

                    if(isBack) {
                        $imageContour = $('<div class="image-contour"></div>');
                    }
                    
                    $imageFrame = $('<div class="image-border">' +
                                        '<div class="image-preview"></div>' +
                                        '<div class="scaler"></div>' +
                                        '<div class="rotator"></div>' +
                                        '<div class="delete"></div>' +
                                    '</div>');
                    
                    $customizer.append($imageContour);
                    $customizer.append($imageFrame);
                    $parent.append($customizer);
                    
                    canvas = $customizer.find('canvas').get(0);
                    context = canvas.getContext('2d');

                    temp_canvas = new Canvas(canvas.width, canvas.height);
                    temp_context = temp_canvas.getContext('2d');
                    data_length = context.getImageData(0,0,canvas.width, canvas.height).data.length;                 
                    
                    var zoomCanvas = new Canvas(canvas.width, canvas.height),
                        zoomContext = zoomCanvas.getContext('2d');
                    
                    var requestId;
                    
                    function update() {
                        if (requestId) {
                            window.cancelAnimationFrame(requestId);
                        }

                        requestId = requestAnimationFrame(renderer);
                        //renderer(); //пока так
                    }

                    function renderer() {
                        zoomContext.clearRect(0, 0, canvas.width, canvas.height);
                        
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.fillStyle = context.createPattern(grid, 'repeat');
                        context.fillRect(0, 0, canvas.width, canvas.height);
                        
                        if (imagesMs.mask) {    
                            zoomContext.putImageData(get_cropped_overlay(), 0, 0);
                        }
                        
                        if (imagesMs.contour) {
                            //drawImageInCenter(zoomContext, imagesMs.contour);
                        }
                        
                        if($imageContour) {
                            var scale = 'scale(' + viewZoom + ')';
                            $imageContour.css({'-webkit-transform': scale, transform: scale}); 
                        }
                        
                        if (imagesMs.overlay) {
                            drawImageInCenter(zoomContext, imagesMs.overlay);
                        }
                        
                     var current_data = context.getImageData(0,0,canvas.width, canvas.height),
                            current_data_data = current_data.data,
                            crop_data = zoomContext.getImageData(0,0,canvas.width, canvas.height).data,
                            opacity,
                            i = data_length - 4;
                            
                        while (i -= 4) {
                            opacity = crop_data[i + 3];
                            current_data_data[i] = (current_data_data[i] * (0x100 - opacity) + crop_data[i] * opacity) >> 8;
                            current_data_data[i + 1] = (current_data_data[i + 1] * (0x100 - opacity) + crop_data[i + 1] * opacity) >> 8;
                            current_data_data[i + 2] = (current_data_data[i + 2] * (0x100 - opacity) + crop_data[i + 2] * opacity) >> 8;

                        }
                        
                        context.putImageData(current_data, 0, 0);
                    }
                    
                    function get_cropped_overlay() {                        
                        temp_context.clearRect(0, 0, canvas.width, canvas.height);
                        
                        drawImageInCenter(temp_context, imagesMs.mask);
                        
                        var temp_context_data = temp_context.getImageData(0,0,canvas.width, canvas.height).data;
                        
                        temp_context.fillStyle = color;
                        temp_context.fillRect(0, 0, canvas.width, canvas.height);
                        
                        var data = temp_context.getImageData(0,0,canvas.width, canvas.height),
                        temp_context_colored_data = data.data;
                        
                        if (image) {                            
                            var width = image.width * zoom *viewZoom,
                                height = image.height * zoom *viewZoom,                                
                                
                                t_canvas = new Canvas(canvas.width, canvas.height),
                                t_context = t_canvas.getContext('2d'),
                                
                                offsetN = {
                                    x: (canvas.width - (width * Math.cos(rotation) - height * Math.sin(rotation))) / 2 + position.x * viewZoom,
                                    y: (canvas.height - (width * Math.sin(rotation) + height * Math.cos(rotation))) / 2 + position.y * viewZoom
                                };
                            
                            t_context.fillStyle = color;
                            t_context.fillRect(0, 0, canvas.width, canvas.height);
                            
                            t_context.translate(offsetN.x , offsetN.y , width, height);
                            t_context.rotate(rotation);

                            t_context.drawImage(image, 0, 0, width, height);
                            t_context.rotate(-rotation);
                            
                            var cImage = t_context.getImageData(0,0,canvas.width, canvas.height).data;

                            $imageFrame.css({
                                display: 'block',
                                width: width ,
                                height: height ,
                                'margin-left': -width / 2,
                                'margin-top': -height / 2
                            });
                         
                            var translation = 'translate(' + (position.x * viewZoom - BORDER_WIDTH) + 'px, ' + (position.y * viewZoom - BORDER_WIDTH) + 'px)',
                                rotationN = 'rotate(' + rotation + 'rad)',
                                transformation = ([translation, rotationN]).join(' ');
                            
                            $imageFrame.css({'-webkit-transform': transformation, transform: transformation});                            
                            
                            for(var i=0; i < data_length; i+=4) {
                                temp_context_colored_data[i] = cImage[i];
                                temp_context_colored_data[i + 1] = cImage[i + 1];
                                temp_context_colored_data[i + 2] = cImage[i + 2];
                                
                                temp_context_colored_data[i + 3] = temp_context_data[i];
                            }
                        } else {                        
                            for(var i=0; i < data_length; i+=4) {
                                temp_context_colored_data[i + 3] = temp_context_data[i];
                            }
                        }
                            
                        return data;
                    }
                    
                    function drawImageInCenter(drawContext, drawImage, offset_x, offset_y, width, height) {
                        offset_x = offset_x || 0;
                        offset_y = offset_y || 0;
                        var width = width || drawImage.width;
                        var height = height || drawImage.height;
                        
                        drawContext.drawImage(drawImage, canvas.width/2 - drawImage.width*viewZoom/2 + offset_x, canvas.height/2 - drawImage.height*viewZoom/2 + offset_y, width*viewZoom, height*viewZoom);
                    }

                    var self = this;
                    $customizer.on('dragover', function (event) {
                        event.preventDefault();
                        $(this).addClass('dragover');
                        return false;
                    }).on('dragleave', function (event) {
                        event.preventDefault();
                        $(this).removeClass('dragover');
                        return false;
                    }).on('drop', function (event) {
                        $(this).removeClass('dragover');
                        
                        event.preventDefault();

                        if(event.originalEvent.dataTransfer.getData("imageSrc")) {
                            if(!image) {
                                qSticker.event.trigger('editCustomizer:imageAdd'); 
                            }
                            self.image = event.originalEvent.dataTransfer.getData("imageSrc");
                        }
                    });

                    function disable_track(event) {
                        canImageFrameAnimate = true;
                        $(window).off('mousemove.track');
                        if (typeof event == 'undefined' || typeof event.target == 'undefined' || $(event.target).parents('.image-border').length == 0) {
                            hideImageFrame();
                        }
                    }
                    
                    $customizer.on('mousedown', function (init_event) {
                        $(window).on('mouseup', disable_track).on('blur', disable_track);
                        
                        var start_offset = position;

                        $(window).on('mousemove.track', function (current_event) {
                            self.offset = {
                                x: start_offset.x * viewZoom + (current_event.screenX - init_event.screenX),
                                y: start_offset.y * viewZoom + (current_event.screenY - init_event.screenY)
                            }                     
                        });
                        
                        return false;
                    })
                    
                    $imageFrame.find('.rotator').on('mousedown', function (init_event) {
                        $(window).on('mouseup', disable_track).on('blur', disable_track);

                        canImageFrameAnimate = false;
                        showImageFrame();

                        var blockX = $imageFrame.offset().left  + (Math.abs($imageFrame.width() * Math.cos(rotation)) + Math.abs($imageFrame.height() * Math.sin(rotation))) / 2,
                            blockY = $imageFrame.offset().top   + (Math.abs($imageFrame.width() * Math.sin(rotation)) + Math.abs($imageFrame.height() * Math.cos(rotation))) / 2,
                            correction = Math.PI / 2 - Math.atan2(image.width, image.height),
                            shiftX = $(this).offset().left + $(this).width() / 2.2 - init_event.pageX,
                            shiftY = $(this).offset().top + $(this).height() / 2.2 - init_event.pageY;
                        
                        $(window).on('mousemove.track', function (current_event) {
                            self.rotation = Math.atan2(blockY - (current_event.pageY + shiftY), blockX - (current_event.pageX + shiftX)) + correction;
                        });
                        
                        return false;
                    })
                    
                    $imageFrame.find('.scaler').on('mousedown', function (init_event) {
                        $(window).on('mouseup', disable_track).on('blur', disable_track);

                        canImageFrameAnimate = false;
                        showImageFrame();

                        var blockX = $imageFrame.offset().left  + (Math.abs($imageFrame.width() * Math.cos(rotation)) + Math.abs($imageFrame.height() * Math.sin(rotation))) / 2,
                            blockY = $imageFrame.offset().top   + (Math.abs($imageFrame.width() * Math.sin(rotation)) + Math.abs($imageFrame.height() * Math.cos(rotation))) / 2,
                            etalon = Math.pow(image.width/2, 2) + Math.pow(image.height/ 2, 2),
                            shiftX = $(this).offset().left + $(this).width() / 2.2 - init_event.pageX,
                            shiftY = $(this).offset().top + $(this).height() / 2.2 - init_event.pageY;

                        $(window).on('mousemove.track', function (current_event) {
                            current_event.preventDefault();
                            
                            var current = Math.pow(current_event.pageX - blockX + shiftX, 2) + Math.pow(current_event.pageY - blockY + shiftY, 2);

                            self.zoom = Math.sqrt(current) / viewZoom / (Math.sqrt(etalon));
                        });
                        return false;
                    })
                    
                    $imageFrame.find('.delete').on('mousedown', function (event) {
                        self.image = undefined;                        
                        return false;
                    })
                    
                    $customizer.find('.plus').on('click', function(event) {
                        self.plusZoom();
                    })
                    
                    $customizer.find('.plus').on('mousedown', function(event) {
                        disable_track();
                        return false;
                    })
                    
                    $customizer.find('.minus').on('click', function(event) {
                        self.minusZoom();update();
                    })
                    
                    $customizer.find('.minus').on('mousedown', function(event) {
                        disable_track();                        
                        return false;
                    })

                    var showImageFrame = function() {
                            if ($imageContour) {
                                $imageContour.css({opacity: 1});
                            }
                            $imageFrame.find('.image-preview').css({opacity: .5});
                        }, hideImageFrame = function() {
                            if ($imageContour) {
                                $imageContour.css({opacity: 0});
                            }
                            $imageFrame.find('.image-preview').css({opacity: 0});
                        };


                    $imageFrame.on('mouseenter', function (event) {
                        if (canImageFrameAnimate) {
                            showImageFrame();
                        }
                    })
                    
                    $imageFrame.on('mouseleave', function (event) {
                        if (canImageFrameAnimate) {
                            hideImageFrame();
                        }
                    })

                    Object.defineProperties(this, {
                         'contour': {
                            get: function() {
                                return contour; 
                            },
                            set: function(value) {
                                $imageContour.removeClass(contour);
                                contour = value;
                                $imageContour.addClass(contour);
                            }
                        },     
                        'rotation': {
                            get: function() {
                                return rotation; 
                            },
                            set: function(value) {
                                rotation = value;
                            
                                update();
                            }
                        },                        
                        'zoom': {
                            get: function() {
                                return zoom; 
                            },
                            set: function(value) {
                                // из-за этого ошибка на больших фотках
//                                if (value < 0.2 * viewZoom) {
//                                    return;
//                                }
                                
                                zoom = Math.min(value * viewZoom, max_zoom * viewZoom) / viewZoom ;

                                update();
                            }
                        },
                        'offset': {
                            get: function() {
                                return position;
                            },
                            set: function(value) {
                                position = {
                                    x: value.x / viewZoom,
                                    y: value.y / viewZoom
                                };                            
                                
                                update();
                            }                                
                        },
                        'color': {
                            get: function() {
                                return color;
                            },
                            set: function(value) {
                                color = 'rgb(' + value.r + ',' + value.g + ',' + value.b + ')';
                                
                                update();
                            }
                        },
                        'imagesMs': {
                            get: function() {
                                return imagesMs;
                            },
                            set: function(value) {
                                imagesMs = value;
                                
                                update();
                            }
                        },
                        'upOverlay': {
                            get: function() {
                                return upOverlay;
                            },
                            set: function(value) {
                                upOverlay = value;
                            }
                        },
                        'image': {
                            get: function() {
                                return image;
                            },
                            set: function(value) {
                                if (value) {
                                    var img = new Image();
                                    
                                    img.onload = function () {
                                        $imageFrame.find('.image-preview').css({
                                            'background-image': 'url(' + value + ')'
                                        });
                                        
                                        $imageFrame.css({
                                            display: 'block',
                                            width: img.width,
                                            height: img.height,
                                            'margin-left': -img.width / 2,
                                            'margin-top': -img.height / 2
                                        });
                                        
                                        image = img;
                                        zoom = max_zoom;
                                        rotation = 0;
                                        position = {
                                            x:0,
                                            y:0
                                        }
                                        
                                        if ((img.width > canvas.width) || (img.height > canvas.height)) {
                                            self.zoom /*= max_zoom*/ = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;                                        
                                        }
                                        
                                        update();
                                    };
                                
                                    img.src = value;
                                } else {
                                    $imageFrame.hide();
                                    image = undefined;
                                    
                                    qSticker.event.trigger('editCustomizer:imageDel');
                                    
                                    update();
                                }
                            }
                        }                        
                    });

                    this.plusZoom = function() {
                        viewZoom = Math.min(1.2, viewZoom + 0.2);

                        update();
                    }
                    
                    this.minusZoom = function() {                   
                        viewZoom = Math.max(0.4, viewZoom - 0.2);

                        update();
                    }
                    
                    this.show = function() {
                        $customizer.show();
                    }
                    
                    this.hide = function() {
                        self.image = undefined;
                        $customizer.hide();
                    },

                    this.createUpImage = function (callback) {
                        var img = new Image();
                            img.onload = function () {
                                var renderCanvas = new Canvas(img.width, img.height);
                                var renderContext = renderCanvas.getContext('2d');
                                
                                renderContext.fillStyle = color;
                                renderContext.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
                                                                
                                renderContext.translate(renderCanvas.width / 2, renderCanvas.height / 2);
                                renderContext.translate(position.x, position.y);
                                renderContext.rotate(rotation);
                                renderContext.drawImage(image, -image.width * zoom/2, -image.height * zoom/2, image.width * zoom, image.height * zoom);
                                renderContext.setTransform(1, 0, 0, 1, 0, 0);
                                renderContext.drawImage(img, 0, 0);
                                
                                var canvas_img = new Image();
                                canvas_img.onload = function () {
                                    callback.call(this, canvas_img);
                                };
                                
                                canvas_img.src = renderCanvas.toDataURL();
                            };

                            if(upOverlay){
                                img.src = upOverlay;
                            } else {
                                console.log('нет апа');
                            }
                    }
                    
                    this.combineImage = function (img1, img2, callback) {
                        var canvas = new Canvas(img1.width + img2.width, Math.max(img1.height, img2.height));
                        var context = canvas.getContext('2d');
                        
                        context.drawImage(img1, 0, 0);
                        context.translate(img1.width, 0);
                        context.drawImage(img2, 0, 0);
                        
                        var img = new Image();
                        img.onload = function() {
                            callback.call(this, img);
                        }
                        img.src = canvas.toDataURL();
                    }
                    
                    this.getScreenShot = function(callback) {
                        var img = new Image();
                        
                        img.onload = function() {
                            callback.call(this, img);
                        }
                        img.src = canvas.toDataURL();
                    }

                    this.getScreen = function(width, height, widthTo, heightTo, callback) {
                        var renderCanvas = new Canvas(widthTo, heightTo);
                        var renderContext = renderCanvas.getContext('2d');
                        
                        renderContext.fillStyle = color;
                        renderContext.fillRect(0, 0, renderCanvas.width, renderCanvas.height);

                        renderContext.translate(renderCanvas.width / 2, renderCanvas.height / 2);
                        renderContext.translate(position.x * (widthTo / width) * zoom, position.y * (heightTo / height) * zoom);
                        renderContext.rotate(rotation);
                        renderContext.drawImage(image, -image.width * zoom * (widthTo / width) / 2, -image.height * zoom * (heightTo / height) / 2, image.width * zoom * (widthTo / width), image.height * zoom * (heightTo / height));
                        
                        var canvas_img = new Image();
                        canvas_img.onload = function () {
                            callback.call(this, canvas_img);
                        };
                        
                        canvas_img.src = renderCanvas.toDataURL();
                    };
                    
                    this.crop = function(image, baseHeight, callback) {
                        var cropCanvas = new Canvas(image.width * baseHeight / image.height, baseHeight),
                            cropContext = cropCanvas.getContext('2d');

                        cropContext.drawImage(image, 0, 0, image.width * baseHeight / image.height, baseHeight);
                        
                        var crop_img = new Image();
                        crop_img.onload = function () {
                            callback.call(this, crop_img);
                        };
                    
                        crop_img.src = cropCanvas.toDataURL();
                    };

                    this.resizeImage = function(image, maxWidth, maxHeight, callback) {
                        var cropCanvas = new Canvas(maxWidth, maxHeight),
                            cropContext = cropCanvas.getContext('2d');

                        if (image.width > maxWidth || image.height > maxHeight) {
                            var maxKoefficient =  maxWidth / maxHeight,
                                currentKoefficient = image.width / image.height,
                                newWidth, newHeight;

                            if (currentKoefficient >= maxKoefficient) {
                                newWidth = maxWidth;
                                newHeight = maxWidth / currentKoefficient;
                            } else {
                                newHeight = maxHeight;
                                newWidth = maxHeight * currentKoefficient;
                            }

                            cropContext.drawImage(image, (maxWidth - newWidth) / 2, (maxHeight - newHeight) / 8, newWidth, newHeight);
                        } else {
                            cropContext.drawImage(image, (maxWidth - image.width) / 2, (maxHeight - image.height) / 8, image.width, image.height);
                        }

                        var crop_img = new Image();
                        crop_img.onload = function () {
                            callback.call(this, crop_img);
                        };

                        crop_img.src = cropCanvas.toDataURL();
                    };
                }

                function buildView($parent) {
                    $customizer = $('<div class="panel-customizers">' +
                                        '<div class="customizers">' +
                                        '</div>' +
                                    '</div>')
                    
                    $parent.append($customizer);
                    
                    var cust = $customizer.find('.customizers');

                    caseCustomizer = new Customizer(cust, 758, 498, 'customizer-case', 'Вид сзади', true);                

                    stickerCustomizerBack = new Customizer(cust, 373, 498, 'customizer-sticker-back', 'Вид сзади', true); 
                    stickerCustomizerFront = new Customizer(cust, 373, 498, 'customizer-sticker-front', 'Вид спереди', false); 
                }
                
                function loadImages(views, callback) {
                    var masks = [],
                        image0 = new Image();
                    image0.onload = function() {
                        masks['mask'] = image0;

                        var image1 = new Image();
                        image1.onload = function() {
                            masks['overlay'] = image1;
                            
                            var image2 = new Image();
                            image2.onload = function() {
                                masks['contour'] = image2;
                                
                                callback.call(this, masks);
                            }
                            
                            image2.src = applicationPath + views['contour'];
                        }
                        
                        image1.src = applicationPath + views['overlay'];
                    }
                    
                    image0.src = applicationPath + views['mask'];
                }
                
                function addEventLisners() {
                    qSticker.event.on('editImageList:imageSelect', function(event, src) {
                        if(currentType == 0) {
                            qSticker.event.trigger('editCustomizer:imageAdd'); 
                            
                            caseCustomizer.image = src;
                        } else {
                            if(stickerCustomizerBack.image) {
                                if(stickerCustomizerFront.image) {
                                    stickerCustomizerBack.image = src;
                                } else {
                                    stickerCustomizerFront.image = src;
                                    
                                    qSticker.event.trigger('editCustomizer:imageAdd'); 
                                }
                            } else {
                                stickerCustomizerBack.image = src;
                                    
                                qSticker.event.trigger('editCustomizer:imageAdd'); 
                                
                            }  
                        }
                    })
                    
                    qSticker.event.on('editPanelTools:selectValue', function(event, actives) {
                        if (actives.activeType == 0) {
                            if(currentType != actives.activeType) {
                                caseCustomizer.show(); 
                                stickerCustomizerFront.hide();
                                stickerCustomizerBack.hide();
                            }
                            
                            caseCustomizer.contour = dataModel[actives.activeGadget].types[actives.activeType].id +'-'+
                                                    dataModel[actives.activeGadget].id;
                            
                            currentType = 0;

                            loadImages(dataModel[actives.activeGadget].types[actives.activeType].views[0], function(views) {
                                caseCustomizer.imagesMs = views;
                            })
                            
                            caseCustomizer.upOverlay = applicationPath + dataModel[actives.activeGadget].types[actives.activeType].render[0].overlay;
                                                     
                        } else {
                            if(currentType != actives.activeType) {
                                caseCustomizer.hide();
                                stickerCustomizerFront.show();
                                stickerCustomizerBack.show(); 
                            }
                            
                            stickerCustomizerBack.contour = dataModel[actives.activeGadget].types[actives.activeType].id +'-'+
                                                    dataModel[actives.activeGadget].id;
                            
                            currentType = 1;
                            
                            loadImages(dataModel[actives.activeGadget].types[actives.activeType].views[0], function(views) {
                                 stickerCustomizerBack.imagesMs = views;
                                 stickerCustomizerBack.upOverlay = applicationPath + dataModel[actives.activeGadget].types[actives.activeType].render[0].overlay
                            })
                            
                            loadImages(dataModel[actives.activeGadget].types[actives.activeType].views[1], function(views) {
                                stickerCustomizerFront.imagesMs = views;
                                stickerCustomizerFront.upOverlay = applicationPath + dataModel[actives.activeGadget].types[actives.activeType].render[1].overlay
                            })
                        }

                        currentGadget = actives.activeGadget;
                    });
                    
                    qSticker.event.on('colorPicker:colorSelect', function(event, rgb) {
                        caseCustomizer.color = rgb;
                        stickerCustomizerFront.color = rgb;
                        stickerCustomizerBack.color = rgb;
                    })
                    
                    qSticker.event.on('editPurchase:purchase', function() {
                        if(currentType == 0) {
                            caseCustomizer.createUpImage(function(image) {
                                caseCustomizer.crop(image, 90, function(croppedImage) {
                                    caseCustomizer.resizeImage(image, productImageMaxSizes.width, productImageMaxSizes.height, function(resizedImage) {
                                        qSticker.event.trigger('editCustomizer:upImage', {product: resizedImage, up: image, crop: croppedImage});
                                    });
                                });
                            });
                        } else {
                            stickerCustomizerBack.createUpImage(function(image1) {
                                stickerCustomizerFront.createUpImage(function(image2) {
                                    stickerCustomizerBack.combineImage(image1, image2, function(image3) {
                                        caseCustomizer.crop(image3, 90, function(croppedImage) {
                                            caseCustomizer.resizeImage(image3, productImageMaxSizes.width, productImageMaxSizes.height, function(resizedImage) {
                                                qSticker.event.trigger('editCustomizer:upImage', {product: resizedImage, up: image3, crop: croppedImage});
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    });
                    
                    qSticker.event.on('endWindow:getImages', function() {

                        switch (dataModel[currentGadget].types[currentType].id) {
                            case 'case':

                                var images = {
                                    'source': caseCustomizer.image.src
                                };

                                caseCustomizer.getScreenShot(function(img) {
                                    images.redactor = img.src;

                                    images.wallpaper = {};

                                    switch (dataModel[currentGadget].id) {
                                        case 'iphone4':

                                            caseCustomizer.getScreen(140, 210, 640, 960, function(img) {
                                                images.wallpaper.back = img.src;
                                                qSticker.event.trigger('endCustomizer:sendImages', images);
                                            });

                                            break;

                                        case 'iphone5':

                                            caseCustomizer.getScreen(144, 256, 640, 1136, function(img) {
                                                images.wallpaper.back = img.src;
                                                qSticker.event.trigger('endCustomizer:sendImages', images);
                                            });

                                            break;
                                    }

                                });

                                break;

                            case 'sticker':
                                var images = {
                                    'source': {
                                        'front':stickerCustomizerFront.image.src,
                                        'back': stickerCustomizerBack.image.src
                                    }
                                };

                                images.wallpaper = {};

                                stickerCustomizerBack.getScreenShot(function(img1) {
                                    stickerCustomizerFront.getScreenShot(function(img2) {
                                        stickerCustomizerBack.combineImage(img1, img2, function(img3) {
                                            images.redactor = img3.src;

                                            switch (dataModel[currentGadget].id) {
                                                case 'iphone4':

                                                    stickerCustomizerFront.getScreen(140, 210, 640, 960, function(img) {
                                                        images.wallpaper.front = img.src;
                                                        stickerCustomizerBack.getScreen(140, 210, 640, 960, function(img) {
                                                            images.wallpaper.back = img.src;
                                                            qSticker.event.trigger('endCustomizer:sendImages', images);
                                                        })
                                                    });

                                                    break;

                                                case 'iphone5':

                                                    stickerCustomizerFront.getScreen(144, 256, 640, 1136, function(img) {
                                                        images.wallpaper.front = img.src;
                                                        stickerCustomizerFront.getScreen(144, 256, 640, 1136, function(img) {
                                                            images.wallpaper.back = img.src;
                                                            qSticker.event.trigger('endCustomizer:sendImages', images);
                                                        })
                                                    });

                                                    break;
                                            }
                                        })
                                    })
                                });
                                break;
                        }
                    });
                     
                }

                return {
                    init: function($parent, model) {
                        dataModel = model;
                        
                        buildView($parent);

                        addEventLisners();
                    }
                }
            })($),
            editHelp = (function($) {
                var $helpType = {},
                    $helpColor = {},
                    $helpLoadImage = {},
                    $helpDragImage = {},
                    $helpDragImageTwo = {},
                    
                    typeState = 0,
                    isTypeChange = false,
                    
                    colorState = 0,
                    isColorChange = false,
                    
                    loadImageState = 0,
                    isLoadImageChange = false,
                    
                    dragImageState = 0,
                    isDragImageChange = false,
                    
                    dragImageStateTwo = 0,
                    isDragImageChangeTwo = false,
                    
                    isFirstShow = true,
                    currentType, currentGadget;
                    
                function buildView($parent) {
                    $helpType = $('<div class="helpType"></div>').appendTo($parent.find('.panel-tools'));
                    $helpColor = $('<div class="helpColor"></div>').appendTo($parent.find('.panel-tools'));
                    $helpLoadImage = $('<div class="helpLoadImage"></div>').appendTo($parent.find('.images-list'));
                    $helpDragImage = $('<div class="helpDragImage"></div>').appendTo($parent.find('.images-list'));
                    $helpDragImageTwo = $('<div class="helpDragImageTwo"></div>').appendTo($parent.find('.images-list'));
                }
                
                function addEventLisners() {
                    qSticker.event.on('qSticker:openWindow', function(event, window) {
                        if(window = 1 && isFirstShow) {
                            isFirstShow = false;
                            
                            if(typeState == 0) {
                                $helpType.delay(500).fadeIn(200, function() {
                                    typeState = 1;
                                    
                                    if(isTypeChange) {
                                        typeState = 2;
                                        
                                        $helpType.fadeOut(200);
                                    } else {
                                        $helpType.delay(10000).fadeOut(200, function() {
                                            typeState = 2;
                                        });
                                    }
                                });
                            }
                            
                            if(colorState == 0) {
                                $helpColor.delay(700).fadeIn(200, function() {
                                    colorState = 1;
                                    
                                    if(isColorChange) {
                                        colorState = 2;
                                        
                                        $helpColor.fadeOut(200);
                                    } else {
                                        $helpColor.delay(10000).fadeOut(200, function() {
                                            typeState = 2;
                                        });
                                    }
                                });
                            }
                            
                            if(loadImageState == 0) {
                                $helpLoadImage.delay(900).fadeIn(200, function() {
                                    loadImageState = 1;
                                    
                                    if(isLoadImageChange) {
                                        loadImageState = 2;
                                        
                                        $helpLoadImage.fadeOut(200);
                                    } else {
                                        $helpLoadImage.delay(10000).fadeOut(200, function() {
                                            typeState = 2;
                                        });
                                    }
                                });
                            }
                            
                            qSticker.event.on('editPanelTools:selectValue', function(event, actives) {
                                currentType = actives.activeType;
                                currentGadget = actives.activeGadget;

                                switch(typeState) {
                                    case 0:
                                        if(!isTypeChange){
                                            isTypeChange = true;
                                        }
                                        break;
                                    case 1:
                                        typeState = 2;
                                        
                                        $helpType.stop(true).fadeOut(200);
                                        break;
                                }
                            })
                            
                            qSticker.event.on('colorPicker:colorSelect', function(event, rgb) {
                                switch(colorState) {
                                    case 0:
                                        if(!isColorChange){
                                            isColorChange = true;
                                        }
                                        break;
                                    case 1:
                                        colorState = 2;
                                        
                                        $helpColor.stop(true).fadeOut(200);
                                        break;
                                }
                            })
                            
                            qSticker.event.on('editImageList:addFirstImage', function(event) {
                                switch(loadImageState) {
                                    case 0:
                                        if(!isLoadImageChange){
                                            isLoadImageChange = true;
                                        }
                                        break;
                                    case 1:
                                        loadImageState = 2;
                                        
                                        $helpLoadImage.stop(true).fadeOut(200);
                                        break;
                                }

                                if(currentType == 0) {
                                    if(dragImageState == 0) {
                                        $helpDragImage.delay(500).fadeIn(200, function() {
                                            dragImageState = 1;
                                            
                                            if(isDragImageChange) {
                                                dragImageState = 2;
                                                
                                                $helpDragImage.fadeOut(200);
                                            } else {
                                                $helpDragImage.delay(10000).fadeOut(200, function() {
                                                    dragImageState = 2;
                                                });
                                            }
                                        });
                                    }
                                    
                                    qSticker.event.on('editCustomizer:imageAdd', function() {
                                        switch(dragImageState) {
                                            case 0:
                                                if(!isDragImageChange){
                                                    isDragImageChange = true;
                                                }
                                                break;
                                            case 1:
                                                dragImageState = 2;
                                                
                                                $helpDragImage.stop(true).fadeOut(200);
                                                break;
                                        }
                                    });
                                    
                                } else {
                                    if(dragImageStateTwo == 0) {
                                        $helpDragImageTwo.delay(500).fadeIn(200, function() {
                                            dragImageStateTwo = 1;
                                            
                                            if(isDragImageChangeTwo) {
                                                dragImageStateTwo = 2;
                                                
                                                $helpDragImageTwo.fadeOut(200);
                                            } else {
                                                $helpDragImageTwo.delay(10000).fadeOut(200, function() {
                                                    dragImageStateTwo = 2;
                                                });
                                            }
                                        });
                                    }
                                    
                                    qSticker.event.on('editCustomizer:imageAdd', function() {
                                        switch(dragImageStateTwo) {
                                            case 0:
                                                if(!isDragImageChangeTwo){
                                                    isDragImageChangeTwo = true;
                                                }
                                                break;
                                            case 1:
                                                dragImageStateTwo = 2;
                                                
                                                $helpDragImageTwo.stop(true).fadeOut(200);
                                                break;
                                        }
                                    });
                                }  
                            })
                        }
                    })
                    
                    qSticker.event.on('editPanelTools:selectValue', function(event, actives) {
                        currentType = actives.activeType;
                        currentGadget = actives.activeGadget;
                    })
                }
                
                return {
                    init: function($parent) {
                        buildView($parent);
                        
                        addEventLisners();
                    }
                }
            })($),
            editPurchase = (function($) {
                var dataModel,
                    currentType, currentGadget,
                    imageCount = 0,
                    $purchase;
                
                function buildView($parent) {
                    $purchase = $('<div class="purchase">' +
                                    '<label>Цена:<span class="price">999 р.</span></label>' +
                                    '<button class="btn btn-primary btn-small">Перейти к оформлению</button>' +
                                '</div>');
                                
                    $parent.append($purchase);
                }
                
                function addEventLisners() {
                    qSticker.event.on('editPanelTools:selectValue', function(event, actives) {
                        currentType = actives.activeType;
                        currentGadget = actives.activeGadget;

                        imageCount = 0;
                        
                        $purchase.find('.price').text(dataModel[actives.activeGadget].types[actives.activeType].price + ' р.');
                    })
                    
                    $purchase.find('button').on('click', function(event) {
                        qSticker.event.trigger('editPurchase:purchase');
                    })
                    
                    qSticker.event.on('editCustomizer:imageAdd', function() {
                        imageCount++;
                        
                        if(currentType == 0) {
                            $purchase.fadeIn();
                        } else {
                            if(imageCount == 2) {
                                $purchase.fadeIn(150);
                            } 
                        }
                    });
                    
                    qSticker.event.on('editCustomizer:imageDel', function() {
                        imageCount--;
                        $purchase.fadeOut(0);
                    });
                }
                
                return {
                    init: function($parent, model) {
                        dataModel = model;
                        
                        buildView($parent);
                        
                        addEventLisners();
                    }
                }
            })($),
            endWindow = (function($) { 
                var dataModel,
                    price,
                    $window,
                    $endSplash,
                    currentPrice,
                    lastImg,
                    productImg,
                    options,
                    selectedOtions = [],
                    dataToSend = {};
                
                function buildView($parent) {
                    $window = $('<div class="product-image">' +
                                    '<img src="" class=up-product>' +                
                                '</div>' +
                                '<div class="product-info">' +
                                    '<h4 class="title"></h4>' +
                                    '<p class="description"></p>' +
                                    '<div class="adds">' +
                                        '<div class="images-crop">' +
                                            '<img src="" class="up-product-crop">' +
                                            '<span class="prdoct-plus">+</span>' +
                                            '<img src="'+applicationPath+'img/content/membrane.png" width=50 height=90 class="product-membrane">' +
                                        '</div>' +
                                        '<div class="options"></div>' +
                                    '</div>' +
                                    '<div class="buyTag">' +
                                        '<span>Цена:<span class="price">1000</span></span> ' +
                                        '<button class="btn btn-primary btn-large">Заказать</button>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="span12 topLine">' +
                                    '<button class="btn btn-mini backEdit"><i class="icon-chevron-left"></i>Вернуться к редактированию</button>' +
                                '</div>');
                    $endSplash = $('<div class="splash">' +
                                        '<div class="last-caption">' +
                                            '<h4><div id="circleG">' +
                                                '<div id="circleG_1" class="circleG"></div>' +
                                                '<div id="circleG_2" class="circleG"></div>' +
                                                '<div id="circleG_3" class="circleG"></div>' +
                                            '</div>' +
                                            'Пожалуйста подождите, ваш заказ создается</h4>'+
                                        '</div>' +
                                   '</div>');
                    
                    $parent.append($endSplash);
                    $parent.append($window);
                }
                
                function  addEventLisners() {
                    $window.find('.buyTag button').on('click', function() {
                        $endSplash.show(200);
                        qSticker.event.trigger('endWindow:getImages');
                    });
                    
                    qSticker.event.on('endCustomizer:sendImages', function(event, images) {
                        var optionsIds = [];
                        
                        $.each(selectedOtions, function(index, value) {
                            if (value) {
                                optionsIds.push(options[index].id);
                            }
                        })
                        
                        dataToSend.optionsIds = optionsIds;
                        dataToSend.images = images;
                        
                        images.product = productImg.src;

                        $.ajax({
                            url: sendPath,
                            type: "POST",
                            dataType: 'json',
                            data: dataToSend,
                            success: mainCallback
                        });
                    });
                    
                    qSticker.event.on('editPanelTools:selectValue', function(event, actives) {
                        dataToSend.gadgetId = dataModel[actives.activeGadget].id;
                        dataToSend.typeId = dataModel[actives.activeGadget].types[actives.activeType].id;
                        options = dataModel[actives.activeGadget].types[actives.activeType].options;
                        
                        $window.find('.title').text(dataModel[actives.activeGadget].types[actives.activeType].name);
                        $window.find('.description').html(dataModel[actives.activeGadget].types[actives.activeType].description);
                        
                        currentPrice = parseInt(dataModel[actives.activeGadget].types[actives.activeType].price, 10);
                        $window.find('.price').text(currentPrice + ' р.');
                        
                        $options = $window.find('.options');
                        $options.empty();
                        
                        dataModel[actives.activeGadget].types[actives.activeType].options.forEach(function(value, index){ 
                            var $option = $('<label class="checkbox">' +
                                                '<input type="checkbox" value="option1" id="inlineCheckbox1">' +  value.description +
                                            '</label>').appendTo($options);
                            
                            $option.find('input').on('click', function() {
                                if($(this).prop('checked')) {
                                    selectedOtions[index] = true;
                                    
                                    currentPrice += parseInt(dataModel[actives.activeGadget].types[actives.activeType].options[index].price, 10);
                                    
                                    $window.find('.price').text(currentPrice + ' р.');
                                } else {
                                    selectedOtions[index] = false;
                                    
                                    currentPrice -= parseInt(dataModel[actives.activeGadget].types[actives.activeType].options[index].price, 10);
                                    
                                    $window.find('.price').text(currentPrice + ' р.');
                                }
                            })
                        })
                    });
                    
                    qSticker.event.on('editCustomizer:upImage', function(event, images) {
                        lastImg = images.up;
                        productImg = images.product;

                        $window.find('.up-product').attr("src", images.up.src);
                        $window.find('.up-product-crop').attr("src", images.crop.src);
                    });

                    dataToSend.color = {
                        r: 255,
                        g: 255,
                        b: 255
                    };
                    qSticker.event.on('colorPicker:colorSelect', function(event, rgb) {
                        dataToSend.color = rgb;
                    })
                }               
                
                return {
                    init: function($parent, model) {
                        dataModel = model;
                        
                        buildView($parent);
                        
                        addEventLisners();
                    }
                }
            })($);
        
        //start
        $window.push($('<div class="window window-start clearfix"></div>').appendTo($parent));
        startProductList.init($window[0], model);
        
        //edit
        $window.push($('<div class="window window-edit clearfix"></div>').appendTo($parent));
        $('body').append('<div class="modal hide fade" id="loadImgModal">' +
                            '<div class="delete" data-dismiss="modal" aria-hidden="true"></div>' +
                            '<div class="modal-body">' +
                                '<div class="modal-drop-img btn-block">' +
                                    '<label>Перетащите картинку в эту область</label>' +
                                '</div>' +
                                '<div class="btn-block or-class">' +
                                   'или' + 
                                '</div>' +
                                '<div class="modal-add-img btn-block">' +
                                    '<label>Выберите картинку на диске</label>' +
                                '</div>' +
                            '</div>' +
                        '</div>')
        editPanelTools.init($window[1], model);
        editCustomizer.init($window[1], model);
        editImageList.init($window[1]);
        editHelp.init($window[1]);
        editPurchase.init($window[1].find('.panel-customizers'), model);
        
        //end
        $window.push($('<div class="window window-end clearfix"></div>').appendTo($parent));
        endWindow.init($window[2], model);
    }
    
    function addEventLisners() {
        $('.windowStep').on('click', function() {
            if(currentWindow == 2) {
                setCurrentWindow(0, true);
            } else {
                setCurrentWindow(currentWindow + 1, true);
            }
               
        })
        
        $('.backEdit').on('click', function(event) {
            setCurrentWindow(currentWindow - 1, true);
        })
        
        qSticker.event.on('startProductList:selectItem', function(event, index) {                   
            setCurrentWindow(1, true);            
        })
        
        qSticker.event.on('editPurchase:purchase', function() {
            setCurrentWindow(2, true);  
        });
    }
    
    function setCurrentWindow(id, showSplash) {
        currentWindow = id;
        
        if(showSplash) {
            $('<div class="splash"></div>').appendTo($('body')).fadeIn(150, function() {
                $.each($window, function(index, value) {
                    $(value).hide();
                })
                $window[id].show();
                
                $(this).fadeOut(150, function() {
                    $(this).remove();

                    qSticker.event.trigger('qSticker:openWindow', currentWindow);
                })
            }) 
        } else {
            $.each($window, function(index, value) {
                $(value).hide();
            })
 
            $window[id].show();
        }  
    }
    
    return {
        run: function(options) {

            var $parentWindow = $(options.appendTo);

            sendPath = options.submitPath;
            mainCallback = options.onComplete;
            applicationPath = options.applicationPath;

            showPreload($parentWindow);

            loader.load(applicationPath + 'ajax/models.json', function(json) {

                // http://thinkpixellab.com/pxloader/
                var pxLoader = new PxLoader(), i;

                for (i in mainPictures) {
                    pxLoader.addImage(applicationPath + mainPictures[i]);
                }

                // callback that will be run once images are ready
                pxLoader.addCompletionListener(function() {
                    hidePreload($parentWindow);

                    buildView($parentWindow, json);

                    setCurrentWindow(0, false);

                    addEventLisners();
                });

                // begin downloading images
                pxLoader.start();
            });
        },
        
        event: {
            on: function (event, callback) {
                $(this).on(event, callback);
            },
            
            trigger: function (event, eventData) {
                $(this).trigger(event, eventData);
            }
        }
    }
})(jQuery);
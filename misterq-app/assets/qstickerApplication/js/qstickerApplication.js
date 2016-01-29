define(['vendor/blueimp-gallery/js/blueimp-gallery', 'vendor/pxLoader/PxLoader', 'jquery', 'underscore', 'vendor/bootstrap/js/bootstrap.min', 'vendor/chosen/chosen.jquery.min'], function(Gallery) {

    var OAuthApi = function() {

        var that = this;
        this.json = {};

        this._sendRequest = function(url, sendParameters, options, onSuccess) {
            $.ajax({
                url: url,
                type: 'get',
                data: sendParameters,
                dataType: 'jsonp',
                beforeSend: options.beforeSend,
                success: function(json) {
                    onSuccess.call(this, json, options);
                }
            });
        };

        this.send = function(settings, provider, method, parameters, options, onSuccess) {
            switch (provider) {
                case 'vk':
                    switch (method) {
                        case 'getAuthorizeUrl':

                            var getParameters = {
                                'client_id': settings['oAuth']['vk']['applicationId'],
                                'scope': 'friends,photos',
                                'redirect_uri': settings['applicationDomain'] + '/?' + $.param({'provider': 'vk', 'action': 'completeAuthorization'}),
                                'display': 'page',
                                'v': '5.2',
                                'response_type': 'token',
                                'revoke': '1'
                            };

                            return 'https://oauth.vk.com/authorize?' + $.param(getParameters);

                            break;

                        case 'getUserInfo':

                            var json = {},
                                userId = parameters['user_id'],
                                methodsArray = {
                                    'friends': {'url': 'friends.get', 'parameters': {'user_id': userId, 'fields': 'first_name,last_name', 'order': 'name'}},
                                    'user': {'url': 'users.get', 'parameters': {'user_ids': userId, 'fields': 'nickname,screen_name,photo_50,photo_100'}},
                                    'albums': {'url': 'photos.getAlbums', 'parameters': {'owner_id': userId, 'need_system': '1', 'need_covers': '1', 'photo_sizes': '1'}}
                                },
                                getParameters = {
                                    'v': '5.2',
                                    'access_token': parameters['access_token']
                                }, methodName, sendParameters, jsonCounter = 0, jsonCount = _(methodsArray).size();

                            for (methodName in methodsArray) {
                                sendParameters = _.extend(getParameters, methodsArray[methodName].parameters);

                                that._sendRequest('https://api.vk.com/method/' + methodsArray[methodName].url, sendParameters, {methodName: methodName, beforeSend: options.beforeSend}, function(jsonAnswer, options) {
                                    that.json[options.methodName] = jsonAnswer;
                                    jsonCounter++;
                                    if (jsonCounter == jsonCount) {
                                        onSuccess.call(that, that.json);
                                    }
                                });
                            }

                            break;

                        case 'getUserAlbums':

                            var userId = options['userId'],
                                methodsArray = {
                                    'albums': {'url': 'photos.getAlbums', 'parameters': {'owner_id': userId, 'need_system': '1', 'need_covers': '1', 'photo_sizes': '1'}}
                                },
                                getParameters = {
                                    'v': '5.2',
                                    'access_token': parameters['access_token']
                                }, methodName = 'albums';

                            sendParameters = _.extend(getParameters, methodsArray[methodName].parameters);

                            that._sendRequest('https://api.vk.com/method/' + methodsArray[methodName].url, sendParameters, {methodName: methodName, beforeSend: options.beforeSend}, function(jsonAnswer, options) {
                                onSuccess.call(that, jsonAnswer);
                            });

                            break;

                        case 'getAlbumPhotos':

                            var userId = options['userId'],
                                albumId = options['albumId'],
                                methodsArray = {
                                    'photos': {'url': 'photos.get', 'parameters': {'owner_id': userId, 'album_id': albumId, 'photo_sizes': '1', 'rev': '1'}}
                                },
                                getParameters = {
                                    'v': '5.2',
                                    'access_token': parameters['access_token']
                                }, methodName = 'photos';

                            sendParameters = _.extend(getParameters, methodsArray[methodName].parameters);

                            that._sendRequest('https://api.vk.com/method/' + methodsArray[methodName].url, sendParameters, {methodName: methodName, beforeSend: options.beforeSend}, function(jsonAnswer, options) {
                                onSuccess.call(that, jsonAnswer);
                            });

                            break;
                    }

                    break;

                case 'instagram':
                    switch (method) {

                        case 'getAuthorizeUrl':

        //                https://instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token

                            var getRedirectParameters = {'provider': 'instagram', 'action': 'completeAuthorization'};

                            if (options && _(options).size() > 0) {
                                getRedirectParameters = _.extend(getRedirectParameters, options);
                            }

                            var getParameters = {
                                'client_id': settings['oAuth']['instagram']['clientId'],
                                'redirect_uri': settings['applicationDomain'] + '?' + $.param(getRedirectParameters),
                                'response_type': 'token',
                                'revoke': '1'
                            };

                            return 'https://instagram.com/oauth/authorize/?' + $.param(getParameters);
                            break;
                    }

                    break;
            }

            return {};
        };
    };

    var Canvas = function(width, height) {
        var canvas = document.createElement('canvas');

        if (width) {
            canvas.width = width;
        }

        if (height) {
            canvas.height = height;
        }

        return canvas;
    };

    var Customizer = function() {
        var that = this;

        this.options = {
            $imageFrame: null,
            $imageContour: null,
            image: null,
            imageThumb: null,
            imageZoom: 1,
            imageRotation: 0,
            imagePosition: [0, 0],
            imageMargin: 70,
            canImageFrameAnimate: true,
            canImageFrameHide: true,
            requestId: null,
            borderWidth: 1,
            customizerSavedState: null,
            customizerSavedIds: null,
            isLoadingPhotos: false,
            $imageDrag: null,
            imageDragStartPosition: [0, 0],
            imageIdsArray: null
        };
        this.settings = {
            showButtons: false,
            showImageFrame: true,
            isFullSizeImage: true,
            isFullSizeEditor: false,
            isDraggableGrid: false,
            isBounceGrid: false,
            grid: [0, 0, 0, 0],
            $canvasContainer: null,
            $gridContainer: null,
            $imageContainer: null,
            zoom: 1,
            editor: null,
            width: null,
            height: null,
            applicationUrl: null,
            folderUrl: null,
            id: null,
            customizerId: null,
            editorObject: null,
            application: null
        };

        this.init = function(settings) {

            $.extend(that.settings, settings);

            this._buildGrid();
            this._buildCanvas();
        };

        this.resize = function(width, height) {

            var oldWidth = that.settings.width,
                oldHeight = that.settings.height;

            that.settings.width = width;
            that.settings.height = height;

            var left, top, width, height;
            if (that.settings.isFullSizeEditor) {
                left = 0;
                top = 0;
                width = that.settings.width;
                height = that.settings.height;
            } else {
                left = that.settings.width / 2 + (that.settings.grid[0] - that.settings.editor.width / 2) * that.settings.zoom;
                top = that.settings.height / 2 + (that.settings.grid[1] - that.settings.editor.height / 2) * that.settings.zoom;
                width = (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom;
                height = (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom;
            }

            that.options.$grid.css({
                top: top,
                left: left,
                width: width,
                height: height
            });

            that.options.position = {
                top: top,
                left: left,
                width: width,
                height: height
            };

            that.options.$canvas.attr({'width': that.settings.width, 'height' : that.settings.height});

            if (that.options.imageObject) {
                that.options.imagePosition[0] = that.options.imagePosition[0] - oldWidth / 2 + that.settings.width / 2;
                that.options.imagePosition[1] = that.options.imagePosition[1] - oldHeight / 2 + that.settings.height / 2;

                var width = that.options.imageObject.width,
                    height = that.options.imageObject.height,
                    zoom = that.options.imageZoom;

                that.options.$imageFrame.css({
                    width: width * zoom,
                    height: height * zoom,
                    left: that.options.imagePosition[0] - width * zoom / 2,
                    top: that.options.imagePosition[1] - height * zoom / 2
                });
            }

            that._updateCanvas();

            that.options.dragPosition = [
                [that.options.$grid.offset().left, that.options.$grid.offset().left + that.options.$grid.width()],
                [that.options.$grid.offset().top, that.options.$grid.offset().top + that.options.$grid.height()]
            ];
        };

        this.destroy = function() {
            that.options.$grid.remove();
            that.options.$canvas.remove();

            if (that.options.$imageFrame) {
                that.options.$imageFrame.remove();
            }
        };

        this._buildGrid = function() {
            var left, top, width, height;
            if (that.settings.isFullSizeEditor) {
                left = 0;
                top = 0;
                width = that.settings.width;
                height = that.settings.height;
            } else {
                left = that.settings.width / 2 + (that.settings.grid[0] - that.settings.editor.width / 2) * that.settings.zoom;
                top = that.settings.height / 2 + (that.settings.grid[1] - that.settings.editor.height / 2) * that.settings.zoom;
                width = (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom;
                height = (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom;
            }

            that.options.$grid = $('<div class="qstickerEditor-grid"></div>').appendTo(that.settings.$gridContainer).css({
                top: top,
                left: left,
                width: width,
                height: height
            }).attr({'data-id': that.settings.id});

            if (that.settings.isFullSizeEditor) {
                that.options.$grid.addClass('qstickerEditor-gridNoBordered');
            }

            that.options.position = {
                top: top,
                left: left,
                width: width,
                height: height
            };

            that.options.dragPosition = [
                [that.options.$grid.offset().left, that.options.$grid.offset().left + that.options.$grid.width()],
                [that.options.$grid.offset().top, that.options.$grid.offset().top + that.options.$grid.height()]
            ];
        };

        this._rebuildGrid = function() {
            if (!that.settings.isFullSizeEditor) {

                var left, top, width, height;

                left = that.settings.width / 2 + (that.settings.grid[0] - that.settings.editor.width / 2) * that.settings.zoom;
                top = that.settings.height / 2 + (that.settings.grid[1] - that.settings.editor.height / 2) * that.settings.zoom;
                width = (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom;
                height = (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom;

                that.options.$grid.css({
                    top: top,
                    left: left,
                    width: width,
                    height: height
                });

                that.options.position = {
                    top: top,
                    left: left,
                    width: width,
                    height: height
                };

                that.options.dragPosition = [
                    [that.options.$grid.offset().left, that.options.$grid.offset().left + that.options.$grid.width()],
                    [that.options.$grid.offset().top, that.options.$grid.offset().top + that.options.$grid.height()]
                ];
            }
        };

        this._buildCanvas = function() {
            that.options.$canvas = $('<canvas></canvas>').appendTo(that.settings.$canvasContainer).attr({'width': that.settings.width, 'height' : that.settings.height});

            that.options.canvas = that.options.$canvas.get(0);
            that.options.context = that.options.canvas.getContext('2d');
        };

        this._updateCanvas = function() {
            if (that.options.requestId) {
                window.cancelAnimationFrame(that.options.requestId);
            }

            var update = function () {
                if (that.options.image && that.options.imageObject) {
                    var maskUrl = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.mask,
                        mask = new Image();
                    mask.onload = function() {
                        if (that.options.imageObject) {
                            that.options.context.clearRect(0, 0, that.settings.width, that.settings.height);

                            var x = that.settings.width / 2 + (that.settings.grid[0] - that.settings.editor.width / 2) * that.settings.zoom,
                                y = that.settings.height / 2 + (that.settings.grid[1] - that.settings.editor.height / 2) * that.settings.zoom,
                                width = (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom,
                                height = (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom,
                                widthImage = (that.options.imageObject.width) * that.options.imageZoom - that.options.borderWidth * 2,
                                heightImage = (that.options.imageObject.height) * that.options.imageZoom - that.options.borderWidth * 2;

                            that.options.context.drawImage(mask, that.settings.grid[0], that.settings.grid[1], that.settings.grid[2] - that.settings.grid[0], that.settings.grid[3] - that.settings.grid[1], x, y, width, height);
                            that.options.context.translate(that.options.imagePosition[0], that.options.imagePosition[1]);
                            that.options.context.globalCompositeOperation = 'source-in';
                            that.options.context.rotate(that.options.imageRotation);
                            that.options.context.drawImage(that.options.imageObject, 0, 0, that.options.imageObject.width, that.options.imageObject.height, -widthImage / 2 - that.options.borderWidth * Math.max(that.options.imageZoom, 0.5) * Math.cos(that.options.imageRotation) + (that.options.imageZoom >= 2 ? 1 / Math.max(3, that.options.imageZoom) : 0) * Math.cos(that.options.imageRotation), -heightImage / 2 - that.options.borderWidth * Math.max(that.options.imageZoom, 0.5) * Math.cos(that.options.imageRotation) + (that.options.imageZoom >= 2 ? 1 / Math.max(3, that.options.imageZoom) : 0) * Math.cos(that.options.imageRotation), widthImage, heightImage);
                            that.options.context.rotate(-that.options.imageRotation);
                            that.options.context.globalCompositeOperation = 'source-over';
                            that.options.context.translate(-that.options.imagePosition[0], -that.options.imagePosition[1]);
                        }
                    };
                    mask.src = maskUrl;
                } else {
                    that.options.context.clearRect(0, 0, that.settings.width, that.settings.height);
                }
            };

            if (window.requestAnimationFrame) {
                that.options.requestId = window.requestAnimationFrame(update);
            } else {
                update();
            }
        };

        this._exportImage = function(onComplete) {
            var canvasImageSource, canvasCounter = 0, canvasCount = 1;

            if (that.options.image) {
                var maskUrl = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.mask,
                    mask = new Image();
                mask.onload = function() {

                    var width = that.settings.grid[2] - that.settings.grid[0] + 2,
                        height = that.settings.grid[3] - that.settings.grid[1] + 2,
                        canvasSource = new Canvas(width, height),
                        contextSource = canvasSource.getContext('2d');

                    contextSource.clearRect(0, 0, width, height);

                    var x = (that.options.imagePosition[0] - that.settings.width / 2) / that.settings.zoom + that.settings.editor.width / 2 - that.settings.grid[0],
                        y = (that.options.imagePosition[1] - that.settings.height / 2) / that.settings.zoom + that.settings.editor.height / 2 - that.settings.grid[1],
                        widthImage = ((that.options.imageObject.width) * that.options.imageZoom) / that.settings.zoom,
                        heightImage = ((that.options.imageObject.height) * that.options.imageZoom) / that.settings.zoom;

                    contextSource.translate(x, y);
                    contextSource.rotate(that.options.imageRotation);
                    contextSource.drawImage(that.options.imageObject, 0, 0, that.options.imageObject.width, that.options.imageObject.height, -widthImage / 2 - that.options.borderWidth * Math.max(that.options.imageZoom, 0.5) * Math.cos(that.options.imageRotation) + (that.options.imageZoom >= 2 ? 1 / Math.max(3, that.options.imageZoom) : 0) * Math.cos(that.options.imageRotation), -heightImage / 2 - that.options.borderWidth * Math.max(that.options.imageZoom, 0.5) * Math.cos(that.options.imageRotation) + (that.options.imageZoom >= 2 ? 1 / Math.max(3, that.options.imageZoom) : 0) * Math.cos(that.options.imageRotation), widthImage, heightImage);
                    contextSource.rotate(-that.options.imageRotation);
                    contextSource.translate(-x, -y);

                    canvasImageSource = new Image();

                    var onLoad = function() {
                        canvasCounter++;
                        if (canvasCounter == canvasCount) {
                            onComplete.call(this, canvasImageSource, that.settings.grid[0] - 1, that.settings.grid[1] - 1, width, height);
                        }
                    };

                    canvasImageSource.onload = onLoad;
                    canvasImageSource.src = canvasSource.toDataURL();
                };
                mask.src = maskUrl;
            } else {
                onComplete.call(this, null, null);
            }
        };

        this._updateZoom = function(zoom) {

            var width = that.options.imageObject.width,
                height = that.options.imageObject.height;

            that.options.imageZoom *= zoom;

            that.options.$imageFrame.css({
                width: width * that.options.imageZoom,
                height: height * that.options.imageZoom,
                left: that.options.imagePosition[0] - width * that.options.imageZoom / 2,
                top: that.options.imagePosition[1] - height * that.options.imageZoom / 2
            });

            that._updateCanvas();
        };

        this._setZoom = function(zoom) {

            if (that.options.image) {
                var width = that.options.imageObject.width,
                    height = that.options.imageObject.height;

                that.options.imageZoom *= zoom;

                that.options.imagePosition[0] = (that.options.imagePosition[0] - that.settings.width / 2) * zoom + that.settings.width / 2;
                that.options.imagePosition[1] = (that.options.imagePosition[1] - that.settings.height / 2) * zoom + that.settings.height / 2;

                that.options.$imageFrame.css({
                    width: width * that.options.imageZoom,
                    height: height * that.options.imageZoom,
                    left: that.options.imagePosition[0] - width * that.options.imageZoom / 2,
                    top: that.options.imagePosition[1] - height * that.options.imageZoom / 2
                });
            }

            that.settings.zoom *= zoom;

            that._rebuildGrid();
            that._updateCanvas();
        };

        this._updatePosition = function(position) {

            if (that.options.imageObject && that.options.imageObject.width && that.options.imageObject.height) {
                var width = that.options.imageObject.width,
                    height = that.options.imageObject.height,
                    zoom = that.options.imageZoom;

                that.options.imagePosition[0] += position[0];
                that.options.imagePosition[1] += position[1];

                if (that.settings.isBounceGrid) {
                    that.options.imagePosition[0] = Math.min(Math.max(that.options.imagePosition[0], that.options.dragBounds[0][0]), that.options.dragBounds[0][1]);
                    that.options.imagePosition[1] = Math.min(Math.max(that.options.imagePosition[1], that.options.dragBounds[1][0]), that.options.dragBounds[1][1]);
                }

                that.options.$imageFrame.css({
                    width: width * zoom,
                    height: height * zoom,
                    left: that.options.imagePosition[0] - width * zoom / 2,
                    top: that.options.imagePosition[1] - height * zoom / 2
                });

                that._updateCanvas();
            }
        };

        this._updateRotation = function(rotation) {
            that.options.imageRotation += rotation;
            var transformation = 'rotate(' + (that.options.imageRotation) + 'rad)';
            that.options.$imageFrame.css({'-webkit-transform': transformation, transform: transformation});

            that._updateCanvas();
        };

        this._deleteImage = function() {
            if (that.options.image) {
                that.options.image = null;
                that.options.imageThumb = null;
                that.options.imageObject = null;
                that.options.$imageFrame.remove();
                that.options.$imageFrame = null;

                that.options.imageZoom = 1;
                that.options.imageRotation = 0;

                that._updateCanvas();
            }
        };

        this._addImage = function(image, imageThumb, showFrame, onComplete) {

            if (!image || !imageThumb) {
                return;
            }

            if (typeof showFrame == 'undefined') { showFrame = true; }

            that._deleteImage();

            that.options.image = image;
            that.options.imageThumb = imageThumb;

            that.options.$imageFrame = $($('#template-qstickerEditorFrame').html()).appendTo(that.settings.$imageContainer);

            var imageObject = new Image();

            imageObject.onload = function () {
                that.options.$imageFrame.find('.qstickerEditor-imagePreview').css({
                    'background-image': 'url(' + image + ')'
                });

                var width = imageObject.width,
                    height = imageObject.height,
                    margin = that.settings.isFullSizeImage ? 10 : that.options.imageMargin,
                    centerX = that.settings.width / 2,
                    centerY = that.settings.height / 2;

                if (that.settings.isFullSizeImage || width > (that.settings.width - margin) || height > (that.settings.height - margin)) {
                    var canvasCoefficient = (that.settings.width - margin) / (that.settings.height - margin),
                        editorCoefficient = (that.settings.grid[2] - that.settings.grid[0] - margin / that.settings.zoom) / (that.settings.grid[3] - that.settings.grid[1] - margin / that.settings.zoom),
                        imageCoefficient = imageObject.width / imageObject.height;

                    if (that.settings.isFullSizeImage) {
                        editorCoefficient = (that.settings.grid[2] - that.settings.grid[0]) / (that.settings.grid[3] - that.settings.grid[1]),
                        imageCoefficient = (imageObject.width - margin) / (imageObject.height - margin);

                        if (editorCoefficient > imageCoefficient) {
                            that.options.imageZoom = (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom / (imageObject.width - margin);
                        } else {
                            that.options.imageZoom = (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom / (imageObject.height - margin);
                        }
                        centerX = that.settings.width / 2 + (that.settings.grid[0] + (that.settings.grid[2] - that.settings.grid[0]) / 2 - that.settings.editor.width / 2) * that.settings.zoom;
                        centerY = that.settings.height / 2 + (that.settings.grid[1] + (that.settings.grid[3] - that.settings.grid[1]) / 2 - that.settings.editor.height / 2) * that.settings.zoom;
                    } else {
                        if (canvasCoefficient > imageCoefficient) {
                            that.options.imageZoom = (that.settings.height - margin) / imageObject.height;
                        } else {
                            that.options.imageZoom = (that.settings.width - margin) / imageObject.width;
                        }
                        centerX = that.settings.width / 2;
                        centerY = that.settings.height / 2;
                    }
                }

                that.options.imagePosition = [
                    centerX,
                    centerY
                ];

                that.options.$imageFrame.css({
                    position: 'absolute',
                    display: 'block',
                    width: width * that.options.imageZoom,
                    height: height * that.options.imageZoom,
                    left: that.options.imagePosition[0] - width * that.options.imageZoom / 2,
                    top: that.options.imagePosition[1] - height * that.options.imageZoom / 2
                }).attr({'data-id': that.settings.id});

                if (!showFrame) {
                    if (that.settings.isFullSizeImage) {
                        that._hideImageFrame();
                    }
                } else {
                    if (that.settings.isFullSizeImage) {
                        that._showImageFrame();
                    }
                    that._showImageFrameAnimate();
                }

                if (that.settings.application.options.isTouchScreen) {
                    that._hideImageFrameTimeout();
                }

                that._updateCanvas();

                if (onComplete && $.isFunction(onComplete)) {
                    onComplete.call(this, that);
                }
            };

            imageObject.src = image;

            that.options.imageObject = imageObject;

            if (!that.settings.showButtons) {
                that.options.$imageFrame.addClass('no-bordered').find('.qstickerEditor-button').hide();
            } else {
                that._setImageButtonsEvents();
            }

            if (that.settings.showImageFrame) {
                that.options.$imageFrame
                    .on('mouseenter', function (event) {
                        if (that.options.canImageFrameAnimate) {
                            that._showImageFrameAnimate();
                        }
                    })
                    .on('mouseleave', function (event) {
                        if (that.options.canImageFrameAnimate) {
                            that._hideImageFrameAnimate();
                        }
                    })
                    .on('touchstart', function() {
                        if (that.options.$imageFrame && that.options.canImageFrameHide) {
                            that._showImageFrame();
                        }
                        that._hideImageFrameTimeout();
                    })
                    .on(that.settings.application.events.current.mousedown, function (initEvent, dragEvent) {

                        if (that.settings.application.options.isTouchScreen) {
                            if (initEvent && initEvent.originalEvent && (initEvent.originalEvent.touches || initEvent.originalEvent.changedTouches)) {
                                initEvent = initEvent.originalEvent.touches[0] || initEvent.originalEvent.changedTouches[0];
                            } else if (dragEvent && dragEvent.originalEvent && (dragEvent.originalEvent.touches || dragEvent.originalEvent.changedTouches)){
                                initEvent = dragEvent.originalEvent.touches[0] || dragEvent.originalEvent.changedTouches[0];
                            } else if (dragEvent && (typeof initEvent.pageX == 'undefined' || typeof initEvent.pageY == 'undefined')) {
                                initEvent = dragEvent;
                            }
                        } else {
                            if (dragEvent && (typeof initEvent.pageX == 'undefined' || typeof initEvent.pageY == 'undefined')) {
                                initEvent = dragEvent;
                            }
                        }

                        var onComplete = function(event) {
                            event.preventDefault();
                            if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            }
                            that._disableTrack(event);

                            if (that.settings.application.options.isTouchScreen) {
                                that._hideImageFrameTimeout();
                            }
                        };

                        $(window).on(that.settings.application.events.current.mouseup+'.qstickerTrack', onComplete).on('blur', onComplete);

                        that.options.canImageFrameAnimate = false;
                        that.options.canImageFrameHide = false;

                        that.settings.application._setImagesBordersState(false);

                        that._showImageFrameAnimate();

                        var startPosition = [initEvent.pageX, initEvent.pageY];

                        if (that.settings.isBounceGrid) {
                            var dragWidth = that.options.imageObject.width * that.options.imageZoom - (that.settings.grid[2] - that.settings.grid[0]) * that.settings.zoom,
                                dragHeight = that.options.imageObject.height * that.options.imageZoom - (that.settings.grid[3] - that.settings.grid[1]) * that.settings.zoom,
                                shiftX = (that.settings.width - that.settings.editor.width * that.settings.zoom) / 2,
                                shiftY = (that.settings.height - that.settings.editor.height * that.settings.zoom) / 2;

                            that.options.dragBounds = [
                                [shiftX + (that.settings.grid[2] + that.settings.grid[0]) / 2 * that.settings.zoom - dragWidth / 2, shiftX + (that.settings.grid[2] + that.settings.grid[0]) / 2 * that.settings.zoom + dragWidth / 2],
                                [shiftY + (that.settings.grid[3] + that.settings.grid[1]) / 2 * that.settings.zoom - dragHeight / 2, shiftY + (that.settings.grid[3] + that.settings.grid[1]) / 2 * that.settings.zoom + dragHeight / 2]
                            ];
                        }

                        $(window).off(that.settings.application.events.current.mousemove+'.qstickerTrack').on(that.settings.application.events.current.mousemove+'.qstickerTrack', function (event) {
                            event.preventDefault();

                            if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            }

                            if (that.settings.isDraggableGrid && that.options.image) {
                                // нужно убрать изображение
                                var customizer;

                                if (event.pageX < that.options.dragPosition[0][0] || event.pageX > that.options.dragPosition[0][1] || event.pageY < that.options.dragPosition[1][0] || event.pageY > that.options.dragPosition[1][1]) {
//                                    that._disableTrack(event);
                                    var image = that.options.image,
                                        imageThumb = that.options.imageThumb;

                                    if (!that.options.$imageDrag) {
                                        that.options.$imageDrag = $('<div class="imagesContainer-image" style="background-image: url(' + imageThumb + ')"></div>').appendTo('body').css({
                                            position: 'absolute',
                                            'z-index': 9999
                                        });

                                        that._hideImageFrame();
                                        that.options.$canvas.hide();
                                    }

                                    that.options.imageDragStartPosition = [that.options.$imageDrag.outerWidth() / 2 + 20, that.options.$imageDrag.outerHeight() / 2 + 20];

                                    that.options.$imageDrag.css({
                                        left: event.pageX - that.options.imageDragStartPosition[0],
                                        top: event.pageY - that.options.imageDragStartPosition[1]
                                    });

                                    $(window).on(that.settings.application.events.current.mouseup + '.qstickerDragCustomizerImage', function() {
                                        $(window).off('.qstickerDragCustomizerImage');

                                        that._deleteImage();

                                        that.options.$canvas.show();

                                        if (that.options.$imageDrag) { that.options.$imageDrag.remove(); }
                                        that.options.$imageDrag = null;

                                        if (that.options.imageIdsArray !== null) {
                                            customizer = that.settings.application.options.editors[that.options.imageIdsArray.editorId].options.customizers[that.options.imageIdsArray.customizerId];
                                            customizer.options.$grid.removeClass('qstickerEditor-gridDragover');
                                            that.options.imageIdsArray = null;

                                            customizer._addImage(image, imageThumb);
                                        }
                                    });

                                    var imageIdsArray = that.settings.application._checkImageToCustomizer(event);

                                    if (imageIdsArray !== null) {

                                        if (that.options.imageIdsArray && (that.options.imageIdsArray.editorId != imageIdsArray.editorId || that.options.imageIdsArray.customizerId != imageIdsArray.customizerId)) {
                                            customizer = that.settings.application.options.editors[that.options.imageIdsArray.editorId].options.customizers[that.options.imageIdsArray.customizerId];
                                            customizer.options.$grid.removeClass('qstickerEditor-gridDragover');
                                        }

                                        if (!that.options.imageIdsArray || (that.options.imageIdsArray.editorId != imageIdsArray.editorId || that.options.imageIdsArray.customizerId != imageIdsArray.customizerId)) {
                                            that.options.imageIdsArray = imageIdsArray;
                                            customizer = that.settings.application.options.editors[that.options.imageIdsArray.editorId].options.customizers[that.options.imageIdsArray.customizerId];
                                            customizer.options.$grid.addClass('qstickerEditor-gridDragover');
                                        }

                                    } else if (that.options.imageIdsArray !== null) {
                                        customizer = that.settings.application.options.editors[that.options.imageIdsArray.editorId].options.customizers[that.options.imageIdsArray.customizerId];
                                        customizer.options.$grid.removeClass('qstickerEditor-gridDragover');
                                        that.options.imageIdsArray = null;
                                    }

                                } else {
                                    // мы в зоне
                                    if (that.options.$imageDrag) {

                                        $(window).off('.qstickerDragCustomizerImage');

                                        that.options.$imageDrag.remove();
                                        that.options.$imageDrag = null;

                                        that._showImageFrame();
                                        that._showImageFrameAnimate();

                                        that.options.$canvas.show();

                                        if (that.options.imageIdsArray !== null) {
                                            customizer = that.settings.application.options.editors[that.options.imageIdsArray.editorId].options.customizers[that.options.imageIdsArray.customizerId];
                                            customizer.options.$grid.removeClass('qstickerEditor-gridDragover');
                                            that.options.imageIdsArray = null;
                                        }
                                    }

                                    that._updatePosition([event.pageX - startPosition[0], event.pageY - startPosition[1]]);
                                    startPosition = [event.pageX, event.pageY];
                                }
                            }
                        });

                        return false;
                    });

                if (that.settings.isFullSizeImage) {
//                    that._hideImageFrame();

                    var onMouseout = function(event) {
                        var $imageBorder = $(event.toElement).parents('.qstickerEditor-imageBorder');
                        if ($imageBorder.length == 0 && $(event.toElement).hasClass('qstickerEditor-imageBorder')) {
                            $imageBorder = $(event.toElement);
                        }
                        var isShow = $imageBorder.length > 0 && $imageBorder.attr('data-id') == that.settings.id;
                        if (!isShow && that.options.canImageFrameHide) {
                            that._hideImageFrame();
                        }
                    };

                    that.options.$grid
                        .on('mouseover', function() {
                            if (that.options.$imageFrame && that.options.canImageFrameHide) {
                                that._showImageFrame();
                            }
                        })
                        .on('mouseout', onMouseout)
                        .on('touchstart', function(event) {
                            if (that.options.$imageFrame && that.options.canImageFrameHide) {
                                that._showImageFrame();
                                that.options.$imageFrame.triggerHandler('touchstart', event);
                            }
                        });

                    that.options.$imageFrame.on('mouseout', onMouseout);
                    that.options.$imageFrame.find('.qstickerEditor-imagePreview').on('mouseout', onMouseout);
                    that.options.$imageFrame.find('.qstickerEditor-button').on('mouseout', onMouseout);
                }
            } else {
                that.options.$imageFrame.hide();
            }
        };

        this._hideImageFrameTimeout = function() {
            if (that.options.imageFrameTimeout) {
                clearTimeout(that.options.imageFrameTimeout);
            }

            that.options.imageFrameTimeout = setTimeout(function() {
                if (that.options.canImageFrameAnimate) {
                    if (that.settings.isFullSizeImage) {
                        that._hideImageFrame();
                    } else {
                        that._hideImageFrameAnimate();
                    }
                }
            }, 500);
        };

        this._setImageButtonsEvents = function() {
            that.options.$imageFrame.find('.qstickerEditor-buttonDelete').on(that.settings.application.events.current.mousedown, function (initEvent) {
                initEvent.preventDefault();
                that._hideImageFrame();
                that._deleteImage();
            });
            that.options.$imageFrame.find('.qstickerEditor-buttonRotate').on(that.settings.application.events.current.mousedown, function (initEvent) {
                initEvent.preventDefault();

                if (that.settings.application.options.isTouchScreen && initEvent.originalEvent) {
                    initEvent = initEvent.originalEvent.touches[0] || initEvent.originalEvent.changedTouches[0];
                }

                var onComplete = function(event) {
                    event.preventDefault();
                    if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                        event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    }
                    that._disableTrack(event);
                    if (that.settings.application.options.isTouchScreen) {
                        that._hideImageFrameTimeout();
                    }
                };

                $(window).on(that.settings.application.events.current.mouseup+'.qstickerTrack', onComplete).on('blur.qstickerTrack', onComplete);

                that.options.canImageFrameAnimate = false;
                that.options.canImageFrameHide = false;
                that.settings.application._setImagesBordersState(false);

                that._showImageFrameAnimate();

                var diagonalLength = Math.sqrt(Math.pow(that.options.imageObject.width * that.options.imageZoom / 2, 2) + Math.pow(that.options.imageObject.height * that.options.imageZoom / 2, 2)),
                    centerX = that.settings.$gridContainer.offset().left + that.options.imagePosition[0],
                    centerY = that.settings.$gridContainer.offset().top + that.options.imagePosition[1],
                    rightBottomAngle = that.options.imageRotation + Math.atan2(that.options.imageObject.height, that.options.imageObject.width),
                    leftBottomAngle = that.options.imageRotation + Math.atan2(that.options.imageObject.height, -that.options.imageObject.width),
                    leftBottomX = centerX + diagonalLength * Math.cos(leftBottomAngle),
                    leftBottomY = centerY + diagonalLength * Math.sin(leftBottomAngle),
                    rightBottomX = centerX + diagonalLength * Math.cos(rightBottomAngle),
                    rightBottomY = centerY + diagonalLength * Math.sin(rightBottomAngle),
                    shiftX = leftBottomX - initEvent.pageX,
                    shiftY = leftBottomY - initEvent.pageY,
                    rotation = Math.atan2(centerY - leftBottomY, centerX - leftBottomX);

                $(window).on(that.settings.application.events.current.mousemove+'.qstickerTrack', function (event) {
                    if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                        event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    }
                    var currentRotation = Math.atan2(centerY - (event.pageY + shiftY), centerX - (event.pageX + shiftX));
                    that._updateRotation(currentRotation - rotation);
                    rotation = currentRotation;
                });

                return false;
            });

            that.options.$imageFrame.find('.qstickerEditor-buttonScale').on(that.settings.application.events.current.mousedown, function (initEvent) {
                initEvent.preventDefault();

                if (that.settings.application.options.isTouchScreen && initEvent.originalEvent) {
                    initEvent = initEvent.originalEvent.touches[0] || initEvent.originalEvent.changedTouches[0];
                }

                var onComplete = function(event) {
                    event.preventDefault();
                    if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                        event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    }
                    that._disableTrack(event);
                    if (that.settings.application.options.isTouchScreen) {
                        that._hideImageFrameTimeout();
                    }
                };

                $(window).on(that.settings.application.events.current.mouseup+'.qstickerTrack', onComplete).on('blur.qstickerTrack', onComplete);

                that.options.canImageFrameAnimate = false;
                that.options.canImageFrameHide = false;
                that.settings.application._setImagesBordersState(false);
                that._showImageFrameAnimate();

                var diagonalLength = Math.sqrt(Math.pow(that.options.imageObject.width * that.options.imageZoom / 2, 2) + Math.pow(that.options.imageObject.height * that.options.imageZoom / 2, 2)),
                    centerX = that.settings.$gridContainer.offset().left + that.options.imagePosition[0],
                    centerY = that.settings.$gridContainer.offset().top + that.options.imagePosition[1],
                    rightBottomAngle = that.options.imageRotation + Math.atan2(that.options.imageObject.height, that.options.imageObject.width),
                    leftBottomAngle = that.options.imageRotation + Math.atan2(that.options.imageObject.height, -that.options.imageObject.width),
                    leftBottomX = centerX + diagonalLength * Math.cos(leftBottomAngle),
                    leftBottomY = centerY + diagonalLength * Math.sin(leftBottomAngle),
                    rightBottomX = centerX + diagonalLength * Math.cos(rightBottomAngle),
                    rightBottomY = centerY + diagonalLength * Math.sin(rightBottomAngle),
                    shiftX = rightBottomX - initEvent.pageX,
                    shiftY = rightBottomY - initEvent.pageY,
                    distance = Math.sqrt(Math.pow(rightBottomX - centerX, 2) + Math.pow(rightBottomY - centerY, 2));

                $(window).on(that.settings.application.events.current.mousemove+'.qstickerTrack', function (event) {
                    event.preventDefault();
                    if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                        event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    }
                    var currentDistance = Math.sqrt(Math.pow(event.pageX - centerX + shiftX, 2) + Math.pow(event.pageY - centerY + shiftY, 2)),
                        zoom = currentDistance / distance;

                    distance = currentDistance;
                    that._updateZoom(zoom);
                });
                return false;
            });
        };

        this._disableTrack = function(event) {
            that.options.canImageFrameAnimate = true;
            that.options.canImageFrameHide = true;
            that.settings.application._setImagesBordersState(true);

            $(window).off('.qstickerTrack');

            if (that.settings.application.options.isTouchScreen && event.originalEvent) {
                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            }

            var $imageBorder = event ? $(event.target).parents('.qstickerEditor-imageBorder') : [],
                $imageGrid = event ? $(event.target).parents('.qstickerEditor-grid') : [];
            if ($imageBorder.length == 0 && $(event.target).hasClass('qstickerEditor-imageBorder')) {
                $imageBorder = $(event.target);
            }
            if ($imageGrid.length == 0 && $(event.target).hasClass('qstickerEditor-grid')) {
                $imageGrid = $(event.target);
            }

            if (typeof event == 'undefined' || typeof event.target == 'undefined' || $imageBorder.length == 0 || $imageBorder.attr('data-id') != that.settings.id) {
                that._hideImageFrameAnimate();
            }
            if (that.settings.isFullSizeImage) {
                var isShow = $imageBorder.length > 0 && $imageBorder.attr('data-id') == that.settings.id;
                if (!isShow && that.options.$imageFrame) {
                    that._hideImageFrame();
                }
            }
            if ($imageGrid.length > 0 && $imageGrid.attr('data-id') != that.settings.id) {
                that.settings.application._showCustomizerFrame($imageGrid.attr('data-id'));
            }
            if ($imageBorder.length > 0 && $imageBorder.attr('data-id') != that.settings.id) {
                that.settings.application._showCustomizerFrame($imageBorder.attr('data-id'));
            }
        };

        this._showImageFrame = function() {
            if (that.options.$imageFrame) { that.options.$imageFrame.show(); }
            that.settings.editorObject._showEditorOverlay();
        };

        this._hideImageFrame = function() {
            if (that.options.$imageFrame) { that.options.$imageFrame.hide().find('.qstickerEditor-imagePreview').css({opacity: 0}); }
            that.settings.editorObject._hideEditorOverlay();
        };

        this._showImageFrameAnimate = function() {
            if (that.options.$imageContour) { that.options.$imageContour.css({opacity: 1}); }
            if (that.options.$imageFrame) { that.options.$imageFrame.find('.qstickerEditor-imagePreview').css({opacity: .4}); }
            that.settings.editorObject._showEditorOverlay();
        };

        this._hideImageFrameAnimate = function() {
            if (that.options.$imageContour) { that.options.$imageContour.css({opacity: 0});}
            if (that.options.$imageFrame) { that.options.$imageFrame.find('.qstickerEditor-imagePreview').css({opacity: 0}); }
            that.settings.editorObject._hideEditorOverlay();
        };

        this._setImagesBordersState = function(isShow) {
            that.options.canImageFrameAnimate = isShow;
            that.options.canImageFrameHide = isShow;
        };

        this._showImagesBorders = function(id) {
            that._showImageFrame();
            that._showImageFrameAnimate();
        };

        this._saveState = function() {
            return {
                image: that.options.image,
                imageThumb: that.options.imageThumb,
                position: that.options.imagePosition,
                rotation: that.options.imageRotation,
                zoom: that.options.imageZoom
            };
        };

        this._setState = function(state) {
            if (state.image) {
                that._addImage(state.image, state.imageThumb, false, function() {
                    that.options.imagePosition = state.position;
                    that.options.imageRotation = state.rotation;
                    that.options.imageZoom = state.zoom;

                    that._updatePosition([0, 0]);
                    that._updateRotation(0);
                });
            }
        };
    };

    var Editor = function() {

        var that = this;

        this.options = {
            zoom: 1,
            borderWidth: 1,
            gridId: 0,
            editorMargin: 80,
            gridBorderColor: '#bbb',
            customizers: [],
            color: '#ffffff',
            maxEditorWidth: 600,
            maxEditorHeight: 600,
            overlayPosition: 'over',
            productOverlayPosition: 'over',
            needColorOverlay: true
        };

        this.settings = {
            width: null,
            height: null,
            $parent: null,
            editor: {},
            id: null,
            gridImageUrl: null,
            folderUrl: null,
            applicationUrl: null,
            productsColors: [],
            application: null
        };

        this.init = function(settings) {

            $.extend(that.settings, settings);

            var editorTemplate = _.template($('#template-qstickerEditor').html());

            that.options.$editor = $(editorTemplate({
                title: that.settings.editor.name
            })).appendTo(that.settings.$parent).width(that.settings.width).height(that.settings.height);

            that.options.$canvas = that.options.$editor.find('canvas').attr({'width': that.settings.width, 'height' : that.settings.height});

            that.options.canvas = that.options.$canvas.get(0);
            that.options.context = that.options.canvas.getContext('2d');

            that.options.$editor.css({
                'background': 'transparent url('+that.settings.gridImageUrl+') repeat left top',
                'border-left': '1px solid #e0e0e0',
                'border-right': '1px solid #e0e0e0'
            });

            that.options.zoom = 1;

            var canvasCoefficient = (that.settings.width - that.options.editorMargin) / (that.settings.height - that.options.editorMargin),
                editorCoefficient = that.settings.editor.width / that.settings.editor.height,
                maxEditorCoefficient = that.options.maxEditorWidth / that.options.maxEditorHeight,
                maxZoom = 1;

            if (canvasCoefficient > editorCoefficient) { // выравниваем по высоте
                that.options.zoom = (that.settings.height - that.options.editorMargin) / that.settings.editor.height;
            } else { // выравниваем по ширине
                that.options.zoom = (that.settings.width - that.options.editorMargin) / that.settings.editor.width;
            }

            if (maxEditorCoefficient > editorCoefficient) { // по высоте
                maxZoom = that.options.maxEditorHeight / that.settings.editor.height;
            } else { // по ширине
                maxZoom = that.options.maxEditorWidth / that.settings.editor.width;
            }

            that.options.zoom = Math.min(that.options.zoom, maxZoom);

            if (that.settings.editor.zoom) {
                that.options.zoom *= that.settings.editor.zoom;
            }

            if (that.settings.editor.overlayPosition) that.options.overlayPosition = that.settings.editor.overlayPosition;
            if (that.settings.editor.productOverlayPosition) that.options.productOverlayPosition = that.settings.editor.productOverlayPosition;

            if (that.settings.editor.colors) {
                that.settings.productsColors = that.settings.editor.colors;
                that.options.color = _(that.settings.productsColors).first();
            }

            if (typeof that.settings.editor.needColorOverlay != 'undefined') {
                that.options.needColorOverlay = that.settings.editor.needColorOverlay ? true : false;
            }

            that._buildOverlay();
            that._buildEditorOverlay();
            that._buildBackground();
            that._buildGrid();

            that._setZoomEvents();
            that._setTypesEvents();
            that._setActionsEvents();
        };

        this.resize = function(width, height) {
            that.settings.width = width;
            that.settings.height = height;

            that.options.$canvas.attr({'width': that.settings.width, 'height' : that.settings.height});
            that.options.$editor.width(that.settings.width).height(that.settings.height);

            that._buildBackground();
            that._rebuildOverlay();
            that._rebuildEditorOverlay();

            var partId;
            for (partId in that.options.customizers) {
                that.options.customizers[partId].resize(width, height);
            }
        };

        this.destroy = function() {
            that.options.$editor.remove();
        };

        this._setZoomEvents = function() {
            that.options.$editor.find('.button-zoom').on(that.settings.application.events.current.click, function(event) {
                event.preventDefault();
                var multiplier = $(this).attr('data-type') == 'plus' ? 1.2 : 0.8;
                that._updateZoom(multiplier);
            });
        };

        this._setActionsEvents = function() {
            var $buttonReset = that.options.$editor.find('.qstickerEditor-actionReset'),
                $buttonRandom = that.options.$editor.find('.qstickerEditor-actionRandom'),
                customizerId;

            $buttonReset.on(that.settings.application.events.current.click, function(event) {
                event.preventDefault();
                for (customizerId in that.options.customizers) {
                    that.options.customizers[customizerId]._deleteImage();
                }
            });
            $buttonRandom.on(that.settings.application.events.current.click, function(event) {
                event.preventDefault();
                var imagesLength = that.settings.application.options.images.length, imageId = 0, imageRange;
                if (imagesLength > 0) {
                    imageRange = _.shuffle(_.range(imagesLength));
                    for (customizerId in that.options.customizers) {
                        if (!(imageId in imageRange)) {
                            imageRange = _.shuffle(_.range(imagesLength));
                            imageId = 0;
                        }
                        that.options.customizers[customizerId]._addImage(that.settings.application.options.images[imageRange[imageId]].data, that.settings.application.options.images[imageRange[imageId]].dataThumb, false);
                        imageId++;
                    }
                }
            });
        };

        this._setTypesEvents = function() {
            var $buttonColorType = that.options.$editor.find('.qstickerEditor-typeColor'),
                $buttonGridType = that.options.$editor.find('.qstickerEditor-typeGrid'),
                grid = that.settings.editor.grids[that.options.gridId], gridId;

            $buttonGridType.css({
                'background-image': 'url('+that.settings.applicationUrl + that.settings.folderUrl + grid.iconUrl+')'
            });

            var gridsContainer = '<div class="qstickerEditor-typeGridContainer">', colorId;
            for (gridId in that.settings.editor.grids) {
                gridsContainer += '<span class="qstickerEditor-typeGrid" style="background-image: url('+that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.grids[gridId].iconUrl+')" data-gridId="'+gridId+'"></span>';
            }
            gridsContainer += '</div>';

            $buttonGridType.popover({
                placement: 'top',
                html: true,
                content: gridsContainer,
                delay: {show: 100, hide: 100},
                container: '#qstickerApplicationWrapper'
            });

            $buttonGridType.on('shown.bs.popover', function () {
                $('.qstickerEditor-typeGridContainer .qstickerEditor-typeGrid[data-gridId="'+that.options.gridId+'"]').addClass('active');

                $(window).on(that.settings.application.events.current.mousedown + '.qstickerPopover', function(event) {
                    if ($(event.target).parents('.popover').length == 0) {
                        $buttonGridType.popover('hide');
                        $(window).off('.qstickerPopover');
                    }
                });

                $('.qstickerEditor-typeGridContainer').on(that.settings.application.events.current.click, '.qstickerEditor-typeGrid', function() {
                    var gridId = $(this).attr('data-gridId');
                    $buttonGridType.popover('hide');
                    $buttonGridType.css({
                        'background-image': 'url('+that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.grids[gridId].iconUrl+')'
                    });
                    that._updateGrid(gridId);
                });
            });

            var colorsContainer = '<div class="qstickerEditor-typeColorContainer">', colorId;
            for (colorId in that.settings.productsColors) {
                colorsContainer += '<span class="qstickerEditor-typeColor" style="background-color: '+that.settings.productsColors[colorId]+'" data-color="'+that.settings.productsColors[colorId]+'"></span>';
            }
            colorsContainer += '</div>';

            $buttonColorType.popover({
                placement: 'top',
                html: true,
                content: colorsContainer,
                delay: {show: 100, hide: 100},
                container: '#qstickerApplicationWrapper'
            });

            $buttonColorType.on('shown.bs.popover', function () {
                $('.qstickerEditor-typeColorContainer .qstickerEditor-typeColor[data-color="'+that.options.color+'"]').addClass('active');

                $(window).on(that.settings.application.events.current.mousedown + '.qstickerPopover', function(event) {
                    if ($(event.target).parents('.popover').length == 0) {
                        $buttonColorType.popover('hide');
                        $(window).off('.qstickerPopover');
                    }
                });

                $('.qstickerEditor-typeColorContainer').on(that.settings.application.events.current.click, '.qstickerEditor-typeColor', function() {
                    var color = $(this).attr('data-color');
                    $buttonColorType.popover('hide');
                    $buttonColorType.css({
                        'background-color': color
                    });
                    that._updateColor(color);
                });
            });

            $buttonColorType.on('hidden.bs.popover', function () {
                $('.popover').remove();
            });

            $buttonGridType.on('hidden.bs.popover', function () {
                $('.popover').remove();
            });
        };

        this._updateZoom = function(zoom) {
            if (((that.settings.editor.width * that.options.zoom < 50 || that.settings.editor.height * that.options.zoom < 50) && zoom < 1) || ((that.settings.editor.width * that.options.zoom > 1300 || that.settings.editor.height * that.options.zoom > 1300) && zoom > 1)) {
                return;
            }

            that.options.zoom *= zoom;

            that._buildBackground();
            that._rebuildOverlay();
            that._rebuildEditorOverlay();

            var partId;
            for (partId in that.options.customizers) {
                that.options.customizers[partId]._setZoom(zoom);
            }
        };

        this._updateGrid = function(gridId) {
            that.options.gridId = gridId;

            var partId;

            for (partId in that.options.customizers) {
                that.options.customizers[partId].destroy();
                delete that.options.customizers[partId];
            }
            that.options.customizers = [];
            that._buildGrid();
        };

        this._buildGrid = function() {
            var partId, part, partsCount = _(that.settings.editor.grids[that.options.gridId].parts).size(), options;
            for (partId in that.settings.editor.grids[that.options.gridId].parts) {
                part = that.settings.editor.grids[that.options.gridId].parts[partId];
                options = {
                    showButtons: false,
                    showImageFrame: true,
                    isFullSizeImage: true,
                    isFullSizeEditor: false,
                    isDraggableGrid: true,
                    isBounceGrid: true,
                    grid: part,
                    $canvasContainer: that.settings.$parent.find('.qstickerEditor-canvasContainer'),
                    $gridContainer: that.settings.$parent.find('.qstickerEditor-gridContainer'),
                    $imageContainer: that.settings.$parent.find('.qstickerEditor-imageContainer'),
                    zoom: that.options.zoom,
                    editor: that.settings.editor,
                    width: that.settings.width,
                    height: that.settings.height,
                    applicationUrl:that.settings.applicationUrl,
                    folderUrl: that.settings.folderUrl,
                    id: that.settings.editor.id + '_' + that.options.gridId + '_' + partId,
                    customizerId: partId,
                    application: that.settings.application,
                    editorObject: that
                };

                if (partsCount == 1) {
                    options.showButtons = true;
                    options.showImageFrame = true;
                    options.isFullSizeImage = false;
                    options.isBounceGrid = false;

                    if (part[0] == 0 && part[1] == 0 && part[2] == that.settings.editor.width && part[3] == that.settings.editor.height) {
                        options.isFullSizeEditor = true;
                    }
                }

                that.options.customizers[partId] = new Customizer();
                that.options.customizers[partId].init(options);
            }
        };

        this._buildOverlay = function() {
            if (that.options.overlayPosition == 'under') {
                that.options.$overlay = that.options.$editor.find('.qstickerEditor-underlay');
            } else {
                that.options.$overlay = that.options.$editor.find('.qstickerEditor-overlay');
            }

            that.options.$overlay.css({
                'background-image': 'url('+(that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.overlay)+')',
                position: 'absolute',
                left: -(that.settings.editor.width * that.options.zoom / 2) + that.settings.width / 2,
                top: -(that.settings.editor.height * that.options.zoom / 2) + that.settings.height / 2,
                width: that.settings.editor.width * that.options.zoom,
                height: that.settings.editor.height * that.options.zoom
            });
        };

        this._rebuildOverlay = function() {
            that.options.$overlay.css({
                left: -(that.settings.editor.width * that.options.zoom / 2) + that.settings.width / 2,
                top: -(that.settings.editor.height * that.options.zoom / 2) + that.settings.height / 2,
                width: that.settings.editor.width * that.options.zoom,
                height: that.settings.editor.height * that.options.zoom
            });
        };

        this._buildEditorOverlay = function() {
            if (that.settings.editor.editorOverlay) {
                that.options.$editorOverlay = that.options.$editor.find('.qstickerEditor-editorOverlay');
                that.options.$editorOverlay.css({
                    'background-image': 'url('+(that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.editorOverlay)+')',
                    position: 'absolute',
                    left: -(that.settings.editor.width * that.options.zoom / 2) + that.settings.width / 2,
                    top: -(that.settings.editor.height * that.options.zoom / 2) + that.settings.height / 2,
                    width: that.settings.editor.width * that.options.zoom,
                    height: that.settings.editor.height * that.options.zoom
                });
            }
        };

        this._rebuildEditorOverlay = function() {
            if (that.settings.editor.editorOverlay) {
                that.options.$editorOverlay.css({
                    left: -(that.settings.editor.width * that.options.zoom / 2) + that.settings.width / 2,
                    top: -(that.settings.editor.height * that.options.zoom / 2) + that.settings.height / 2,
                    width: that.settings.editor.width * that.options.zoom,
                    height: that.settings.editor.height * that.options.zoom
                });
            }
        };

        this._showEditorOverlay = function() {
            if (that.settings.editor.editorOverlay) {
                that.options.$editorOverlay.css({opacity: 1});
            }
        };

        this._hideEditorOverlay = function() {
            if (that.settings.editor.editorOverlay) {
                that.options.$editorOverlay.css({opacity: 0});
            }
        };

        this._buildBackground = function() {
            if (that.options.needColorOverlay) {
                var maskUrl = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.mask,
                    mask = new Image();
                mask.onload = function() {
                    that.options.context.clearRect(0, 0, that.settings.width, that.settings.height);

                    that._drawImageInCenter(that.options.context, that.settings.width, that.settings.height, mask, 0, 0, that.settings.editor.width, that.settings.editor.height, that.options.zoom);

                    that.options.context.globalCompositeOperation = 'source-in';

                    that.options.context.fillStyle = that.options.color;
                    that.options.context.fillRect(0, 0,that.settings.width, that.settings.height);

                    that.options.context.globalCompositeOperation = 'source-over';
                };
                mask.src = maskUrl;
            }
        };

        this._updateColor = function(color) {
            var $buttonColorType = that.options.$editor.find('.qstickerEditor-typeColor');
            that.options.color = color;
            that._buildBackground();
        };

        this._drawImageInCenter = function(context, contextWidth, contextHeight, image, offsetX, offsetY, width, height, zoom) {
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;
            width = width || image.width;
            height = height || image.height;
            zoom = zoom || 1;

            context.drawImage(image, 0, 0, width, height, contextWidth / 2 - width * zoom / 2 + offsetX,  contextHeight / 2 - height * zoom / 2 + offsetY, width * zoom, height * zoom);
        };

        this._exportImage = function(editorId, onComplete) {

            that.options.renderCanvasSource = new Canvas(that.settings.editor.width, that.settings.editor.height);
            that.options.renderContextSource = that.options.renderCanvasSource.getContext('2d');

            var maskUrl = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.mask,
                mask = new Image();
            mask.onload = function() {

                that.options.renderContextSource.clearRect(0, 0, that.settings.editor.width, that.settings.editor.height);

                if (that.options.needColorOverlay) {
                    if (that.options.productOverlayPosition == 'under') {
                        that.options.renderContextSource.drawImage(mask, 0, 0, that.settings.editor.width, that.settings.editor.height);
                        that.options.renderContextSource.globalCompositeOperation = 'source-in';
                    }

                    that.options.renderContextSource.fillStyle = that.options.color;
                    that.options.renderContextSource.fillRect(0, 0,that.settings.editor.width, that.settings.editor.height);

                    if (that.options.productOverlayPosition == 'under') {
                        that.options.renderContextSource.globalCompositeOperation = 'source-over';
                    }
                }

                var partId, partsCount = _(that.options.customizers).size(), partsCounter = 0;

                for (partId in that.options.customizers) {
                    that.options.customizers[partId]._exportImage(function(imageSource, x, y, width, height) {
                        if (imageSource) {
                            that.options.renderContextSource.drawImage(imageSource, x, y, width, height);
                        }
                        partsCounter++;
                        if (partsCounter == partsCount) {
                            // сорс готов

                            var sourceImage = new Image(),
                                productOverlayImage = new Image();

                            sourceImage.onload = function() {

                                productOverlayImage.onload = function() {
                                    var productCanvas = new Canvas(productOverlayImage.width, productOverlayImage.height),
                                        productContext = productCanvas.getContext('2d'),
                                        productImage = new Image(),
                                        x = (productOverlayImage.width - that.settings.editor.width) / 2,
                                        y = (productOverlayImage.height - that.settings.editor.height) / 2;

                                    if (that.options.productOverlayPosition == 'over') {
                                        productContext.drawImage(sourceImage, x, y, that.settings.editor.width, that.settings.editor.height);
                                        productContext.drawImage(productOverlayImage, 0, 0, productOverlayImage.width, productOverlayImage.height);
                                    } else if (that.options.productOverlayPosition == 'under') {
                                        productContext.drawImage(productOverlayImage, 0, 0, productOverlayImage.width, productOverlayImage.height);
                                        productContext.drawImage(sourceImage, x, y, that.settings.editor.width, that.settings.editor.height);
                                    }

                                    productImage.onload = function() {

                                        var returnObject = {
                                                source: sourceImage,
                                                product: productImage
                                            },
                                            imagesCount = 0,
                                            imagesCounter = 0,
                                            onLoad = function(options) {
                                                returnObject[options.name] = options.image;
                                                imagesCounter++;
                                                if (imagesCounter == imagesCount) {
                                                    onComplete.call(this, editorId, returnObject);
                                                }
                                            };

                                        if (typeof that.settings.editor.screen != 'undefined' && that.settings.editor.screen) {
                                            imagesCount++;
                                        }
                                        if (typeof that.settings.editor.tech != 'undefined' && that.settings.editor.tech) {
                                            imagesCount++;
                                        }

                                        if (imagesCount > 0) {
                                            if (typeof that.settings.editor.screen != 'undefined' && that.settings.editor.screen) {
                                                var screen = that.settings.editor.screen,
                                                    screenImage = new Image(),
                                                    screenCanvas = new Canvas(screen.width, screen.height),
                                                    screenContext = screenCanvas.getContext('2d'),
                                                    screenWidth = screen.position[2] - screen.position[0],
                                                    screenHeight = screen.position[3] - screen.position[1],
                                                    zoom = screen.width / screen.height > screenWidth / screenHeight ? screenHeight / screen.height : screenWidth / screen.width,
                                                    x = (screen.width - screenWidth / zoom) / 2,
                                                    y = (screen.height - screenHeight / zoom) / 2;

                                                screenContext.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height, -screen.position[0] / zoom + x, -screen.position[1] / zoom + y, sourceImage.width / zoom, sourceImage.height / zoom);

                                                screenImage.onload = function() {
                                                    onLoad({name: 'screen', image: screenImage});
                                                };

                                                screenImage.src = screenCanvas.toDataURL('image/jpeg');
                                            }

                                            if (typeof that.settings.editor.tech != 'undefined' && that.settings.editor.tech) {
                                                var techImage = new Image(),
                                                    techCanvas = new Canvas(that.settings.editor.tech.width, that.settings.editor.tech.height),
                                                    techContext = techCanvas.getContext('2d'),
                                                    techContextImage = new Image();

                                                techContext.drawImage(sourceImage, parseInt(that.settings.editor.tech.left), parseInt(that.settings.editor.tech.top), parseInt(that.settings.editor.tech.width), parseInt(that.settings.editor.tech.height), 0, 0, that.settings.editor.tech.width, that.settings.editor.tech.height);

                                                techContextImage.onload = function() {
                                                    onLoad({name: 'tech', image: techContextImage});
                                                };

                                                if (typeof that.settings.editor.techOverlay != 'undefined') {
                                                    techImage.onload = function() {
                                                        techContext.drawImage(techImage, 0, 0, techImage.width, techImage.height);
                                                        techContextImage.src = techCanvas.toDataURL('image/jpeg');
                                                    };
                                                    console.log(that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.techOverlay);
                                                    techImage.src = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.techOverlay;
                                                } else {
                                                    techContextImage.src = techCanvas.toDataURL('image/jpeg');
                                                }
                                            }

                                        } else {
                                            onComplete.call(this, editorId, returnObject);
                                        }
                                    };

                                    productImage.src = productCanvas.toDataURL();

//                                var $image = $('<img />').appendTo('body').width(that.settings.editor.width).height(that.settings.editor.height).css({
//                                    position: 'fixed',
//                                    top: 0,
//                                    left: 0,
//                                    zIndex: 1000
//                                }).attr('src', productCanvas.toDataURL());
                                };

                                productOverlayImage.src = that.settings.applicationUrl + that.settings.folderUrl + that.settings.editor.productOverlay;
                            };

                            if (that.options.productOverlayPosition == 'under') {
                                sourceImage.src = that.options.renderCanvasSource.toDataURL();
                            } else if (that.options.productOverlayPosition == 'over') {
                                sourceImage.src = that.options.renderCanvasSource.toDataURL('image/jpeg');
                            }
                        }
                    });
                }
            };
            mask.src = maskUrl;
        };
    };

    var qSticker = function () {

        var that = this;

        this.settings = {
            applicationUrl: "/assets/qstickerApplication/",
            $container: null,
            $wrapper: null,
            $sidebar: null,
            $navbar: null,
            height: 0,
            $productContainer: null,
            $picturesContainer: null,
            $categoriesContainer: null,
            productsData: {},
            getParameters: null
        };

        this.options = {
            stage: 'start',
            $indexImage: null,
            modelsFileName: 'ajax/products.php',
            productId: null,
            productImageMaxSizes: {
                width: 410,
                height: 480
            },
            imageThumbSize: 80,
            editors: {},
            editorsImages: {},
            imagesData: {},
            view: {
                marginTop: 10,
                marginBottom: 10,
                marginSidebarRight: 10,
                imagesContainerHeight: 120,
                imagesUploaderHeight: 40,
                submitContainerHeight: 124,
                submitTopPosition: 52,
                editorHorizontalMargin: 10
            },
            sidebarWidth: 240,
            imagesShiftValue: 120,
            arrowsWidth: 40,
            maxLoadPicturesCount: 40,
            $imageTouchClone: null,
            idsTouchArray: null,
            authorization: {},
            gridPictureUrl: 'img/content/graphy.png',
            membraneUrl: 'img/content/membrane.png',
            loaderUrl: 'img/content/ajax-loader.gif',
            indexPictureUrl: 'img/content/index-picture.png',
            images: [],
            submitUrl: 'php/submit.php',
            productImageThumbWidth: 400,
            productImageThumbHeight: 400,
            productImageIconWidth: 110,
            productImageIconHeight: 110,
            picturesOrderCount: 10,
            mainPictures: [
                that.settings.applicationUrl + 'img/content/hint-choose.png',
                that.settings.applicationUrl + 'img/content/hint-upload.png',
                that.settings.applicationUrl + 'img/content/hint-drag.png',
                that.settings.applicationUrl + 'img/content/graphy.png',
                that.settings.applicationUrl + 'img/content/ajax-loader.gif',
                that.settings.applicationUrl + 'img/content/membrane.png',
                that.settings.applicationUrl + 'img/content/index-picture.png',
                'assets/img/icons/case.jpg',
                'assets/img/icons/cup.jpg',
                'assets/img/icons/gift.jpg',
                'assets/img/icons/magnet.jpg',
                'assets/img/icons/mosaic.jpg',
                'assets/img/icons/sticker.jpg',
                'assets/img/icons/wear.jpg'
            ],
            hints: {
                choose: {
                    url: 'img/content/hint-choose.png',
                    isShow: false
                },
                upload: {
                    url: 'img/content/hint-upload.png',
                    isShow: false
                },
                drag: {
                    url: 'img/content/hint-drag.png',
                    isShow: false,
                    isShowed: false
                },
                timeAnimate: 250,
                timeDelay: 200,
                timeHide: 4000
            }
        };

        this.events = {
            mouse: {
                click: 'click',
                mousedown: 'mousedown',
                mousemove: 'mousemove',
                mouseup: 'mouseup'
            },
            touch: {
                click: 'touchstart',
                mousedown: 'touchstart',
                mousemove: 'touchmove',
                mouseup: 'touchend'
            },
            current: {}
        };

        this.init = function(settings) {
            $.extend(that.settings, settings);

            that.options.isTouchScreen = "ontouchstart" in window;

            that.events.current = that.options.isTouchScreen ? that.events.touch : that.events.mouse;

            that.settings.$sidebar.width(that.options.sidebarWidth);
            that.settings.$wrapper.width(that.settings.$container.width() - that.options.sidebarWidth);

            var topWrapper = that.settings.$wrapper.offset().top,
                leftWrapper = that.settings.$wrapper.offset().left;

            that.settings.$wrapper.css({
                position: 'fixed',
                left: leftWrapper,
                top: topWrapper
            });

            that.options.oAuthApi = new OAuthApi();

            that._showLoader('Пожалуйста, подождите<br/>Приложение загружается');

            that.options.stage = 'preload';

            var loader = new PxLoader(), pictureId;

            for (pictureId in that.options.mainPictures) {
                loader.addImage(that.options.mainPictures[pictureId]);
            }

            loader.addCompletionListener(function(e) {
                that.options.stage = 'start';

                that._hideLoader();

                that._buildProductList(that.settings.productsData.products, that.settings.productsData.productsTypes);
                that._buildImagesContainer();
                that._buildEditorContainer();

                that._buildIndexImage();

                that._setFilesLoadEvent();
                that._setAdditionalEvents();

                that._checkGetParameters();

                that._showHints();
            });

            loader.start();
        };

        this.resize = function(height) {
            that.settings.height = height;

            that.settings.$wrapper.css({position: 'static'});

            that.settings.$sidebar.width(that.options.sidebarWidth);
            that.settings.$wrapper.width(that.settings.$container.width() - that.options.sidebarWidth);

            that.options.$editor.height(that.settings.height - that.options.view.imagesContainerHeight - that.options.view.imagesUploaderHeight);
//            that.options.$editor.height(that.settings.height - that.options.view.imagesContainerHeight - that.options.view.imagesUploaderHeight - that.options.view.marginTop - that.options.view.marginBottom).css({'margin-top': that.options.view.marginTop, 'margin-bottom': that.options.view.marginBottom});

            var topWrapper = that.settings.$wrapper.offset().top,
                leftWrapper = that.settings.$wrapper.offset().left;

            that.settings.$wrapper.css({
                position: 'fixed',
                left: leftWrapper,
                top: topWrapper
            });

            that.options.$imagesContainer
                .height(that.options.view.imagesContainerHeight + that.options.view.imagesUploaderHeight)
                .width($(window).width());

            that.options.$imagesCarousel.css({'min-width': $(window).width() - that.options.arrowsWidth * 2});

            if (that.options.productId) {
                that.options.$submit.css({
                    left: that.settings.$sidebar.offset().left - that.options.view.marginSidebarRight
                });
            }

            that._resizeCarousel();
            that._resizeEditors();
            that._resizeHints();

            if (that.options.$indexImage) {
                that.options.$indexImage.css({
                    height: that.options.$editor.height() - 110,
                    width: that.options.$editor.width() - 40
                });
            }
        };

        this._checkGetParameters = function() {
            console.log(that.settings.getParameters);

            if (that.settings.getParameters && that.settings.getParameters.action && that.settings.getParameters.provider && that.settings.getParameters.action == 'completeAuthorization') {
                switch (that.settings.getParameters.provider) {
                    case 'vk':
                        that._showUploadVkModal(true);
                        break;
                    case 'instagram':
                        that._showUploadInstagramModal(true);
                        break;
                }
            }
        };

        this._resizeEditors = function() {
            var editorId,
                editorsCount = _(that.options.editors).size(),
                width = (that.options.$editor.width() - that.options.view.editorHorizontalMargin * (editorsCount - 1)) / editorsCount,
                height = that.options.$editor.height();

            for (editorId in that.options.editors) {
                that.options.editors[editorId].resize(width, height);
            }
        };

        this._buildIndexImage = function() {
            that.options.$indexImage = $('<div class="qstickerIndexImage"></div>').appendTo(that.settings.$wrapper).css({
                'margin-left': 10,
                'margin-right': 10,
                'margin-top': 65,
                height: that.options.$editor.height() - 110,
                width: that.options.$editor.width() - 40,
                position: 'absolute',
                top: 0
            });

            var $image = $('<img src="'+that.settings.applicationUrl + that.options.indexPictureUrl+'" alt="" />').appendTo(that.options.$indexImage);
            $image.on('load', function() {
                var imageHeight = $image.height(),
                    containerHeight = that.options.$indexImage.height();

                if (containerHeight > imageHeight) {
                    $image.css({'margin-top': (containerHeight - imageHeight) / 2});
                }
            });
        };

        this._destroyIndexImage = function() {
            if (that.options.$indexImage) {
                that.options.$indexImage.remove();
                that.options.$indexImage = null;
            }
        };

        this._setAdditionalEvents = function() {
            that.settings.$navbar.find('li > a').on('click', function(event) {
                event.preventDefault();

                var $link = $(this),
                    id = $link.attr('data-id');

                if ($link.parent().hasClass('active')) {
                    return;
                }

                $('.qstickerNavbar-tabContainer').hide();
                $('.qstickerNavbar-tabContainer[data-id="'+id+'"]').show();

                that._hideHints();
                that._hideLoader();

                that.settings.$navbar.find('li').removeClass('active');
                $link.parent().addClass('active');
            });

            that.settings.$picturesContainer.find('.qstickerSidebar .button-toggle').on('click', function(event) {
                event.preventDefault();

                var $button = $(this),
                    id = $button.attr('data-id');

                if ($button.hasClass('active')) {
                    return;
                }

                that.settings.$picturesContainer.find('.qstickerInformation .qstickerPictures-container').hide();
                that.settings.$picturesContainer.find('.qstickerInformation .qstickerPictures-container[data-id="'+id+'"]').show();

                that.settings.$picturesContainer.find('.qstickerSidebar .button-toggle').removeClass('active');
                $button.addClass('active');
            });

            that.settings.$picturesContainer.find('.qstickerSidebar .button-toggle:first-child').trigger('click');

            that.settings.$picturesContainer.find('.qstickerInformation .qstickerPictures-container a').on('click', function(event) {
                event.preventDefault();
                $links = $(this).parents('.qstickerPictures-container').find('a');

                Gallery($links, {'index': $(this).index()});
            });
        };

        this._showHints = function() {
            setTimeout(function() {
                that._showHint('choose');

                setTimeout(function() {
                    that._showHint('upload');
                }, that.options.hints.timeDelay);

            }, that.options.hints.timeDelay);
        };

        this._showHint = function(hint, delayHide) {
            var imageUrl = that.settings.applicationUrl + that.options.hints[hint].url,
                imageHtml = '<img src="'+imageUrl+'" alt="" class="qstickerHintImage" />',
                left, top, imagesContainerOffset = that.options.$imagesContainer.offset();

            that.options.hints[hint].$image = $(imageHtml).appendTo('body').hide();

            if (!delayHide) { delayHide = that.options.hints.timeHide; }

            switch (hint) {
                case 'choose':
                    var sidebarOffset = that.settings.$sidebar.offset();

                    left = sidebarOffset.left + that.options.sidebarWidth - 30;
                    top = sidebarOffset.top + 20;

                    that.options.hints[hint].$image.css({
                        left: left,
                        top: top
                    });

                    break;

                case 'upload':
                    left = imagesContainerOffset.left + that.options.$imagesContainer.width() / 2 - 350;
                    top = imagesContainerOffset.top - 60;

                    that.options.hints[hint].$image.css({
                        left: left,
                        top: top
                    });

                    break;

                case 'drag':
                    left = imagesContainerOffset.left + that.options.$imagesContainer.width() / 2 - 35;
                    top = imagesContainerOffset.top - 130;

                    that.options.hints[hint].$image.css({
                        left: left,
                        top: top
                    });

                    break;
            }

            setTimeout(function() {
                that._hideHint(hint);
            }, delayHide);

            that.options.hints[hint].isShow = true;
            that.options.hints[hint].$image.fadeIn(that.options.hints.timeAnimate);

            that.options.hints[hint].$image.on(that.events.current.mousedown, function() {
                that._hideHint(hint);
            });
        };

        this._hideHint = function(hint) {
            if (that.options.hints[hint].isShow) {
                that.options.hints[hint].isShow = false;
                that.options.hints[hint].$image.fadeOut(that.options.hints.timeAnimate, function() {
                    that.options.hints[hint].$image.remove();
                });
            }
        };

        this._resizeHints = function() {
            var sidebarOffset = that.settings.$sidebar.offset(),
                imagesContainerOffset = that.options.$imagesContainer.offset(), left, top;

            if (that.options.hints['choose'].isShow) {
                left = sidebarOffset.left + that.options.sidebarWidth - 30;
                top = sidebarOffset.top + 30;

                that.options.hints['choose'].$image.css({
                    left: left,
                    top: top
                });
            }

            if (that.options.hints['upload'].isShow) {
                left = imagesContainerOffset.left + that.options.$imagesContainer.width() / 2 - 255;
                top = imagesContainerOffset.top - 80;

                that.options.hints['upload'].$image.css({
                    left: left,
                    top: top
                });
            }

            if (that.options.hints['drag'].isShow) {
                left = imagesContainerOffset.left + that.options.$imagesContainer.width() / 2 - 35;
                top = imagesContainerOffset.top - 130;

                that.options.hints['drag'].$image.css({
                    left: left,
                    top: top
                });
            }
        };

        this._hideHints = function() {
            that._hideHint('choose');
            that._hideHint('upload');
            that._hideHint('drag');
        };

        this._addImage = function(image) {
            console.log(image);

            that._hideHint('upload');

            if (!that.options.hints.drag.isShowed) {
                that.options.hints.drag.isShowed = true;
                setTimeout(function() {
                    that._showHint('drag', 4500);
                }, that.options.hints.timeDelay);
            }

            if (that.options.images.length == 0) {
                that.options.$imagesContainer.find('#qstickerImagesCarousel').show();
                that.options.$imagesContainer.find('#qstickerImagesUploaderSmall').show();
                that.options.$imagesContainer.find('#qstickerImagesUploaderBig').hide();
            }

            var imageId = that.options.images.length;
            that.options.images.push({data: image, id: imageId});

            var $image = $('<div class="imagesContainer-image imagesContainer-imageLoading" data-imageId="'+imageId+'"><span class="btn btn-danger button-delete" data-imageId="'+imageId+'"><i class="icon-remove"></i></span></div>')
                    .appendTo(that.options.$imagesCarousel);

            $image.on(that.events.current.click, '.button-delete', function () {
                var imageId = $(this).attr('data-imageId');
                that._deleteImage(imageId);
            });

            var imageCanvas = new Canvas(that.options.imageThumbSize, that.options.imageThumbSize),
                imageContext = imageCanvas.getContext('2d'),
                imageThumb = new Image();

            imageThumb.onload = function() {
                var imageZoom = imageThumb.width <= imageThumb.height ? imageThumb.height / that.options.imageThumbSize : imageThumb.width / that.options.imageThumbSize,
                    x = (that.options.imageThumbSize - imageThumb.width / imageZoom) / 2,
                    y = (that.options.imageThumbSize - imageThumb.height / imageZoom) / 2;

                imageContext.drawImage(imageThumb, x, y, imageThumb.width / imageZoom, imageThumb.height  / imageZoom);

                var imageThumbData = imageCanvas.toDataURL();

                $image.removeClass('imagesContainer-imageLoading').css({
                    'background-image': 'url('+imageThumbData+')'
                });

                that.options.images[imageId].dataThumb = imageThumbData;

                $image.on(that.events.current.mousedown, function(event) {
                    event.preventDefault();
                    if (that.options.isTouchScreen && event.originalEvent) {
                        event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    }

                    that._hideHint('drag');

                    that.options.imageTouchStartPosition = [event.pageX - $image.offset().left + 20, event.pageY - $image.offset().top + 20];
                    that.options.$imageTouch = $image;
                    that.options.imageTouch = image;
                    that.options.imageTouchThumb = imageThumbData;

                    $(window)
                        .on(that.events.current.mousemove + '.qstickerDragTouchImage', function(event) {
                            event.preventDefault();
                            if (that.options.isTouchScreen && event.originalEvent) {
                                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            }
                            if (!that.options.$imageTouchClone) {
                                that.options.$imageTouchClone = that.options.$imageTouch.clone().appendTo('body').css({
                                    position: 'absolute',
                                    'z-index': 9999,
                                    left: event.pageX - that.options.imageTouchStartPosition[0],
                                    top: event.pageY - that.options.imageTouchStartPosition[1]
                                });
                                that.options.$imageTouchClone.find('.button-delete').hide();
                            } else {
                                that.options.$imageTouchClone.css({
                                    left: event.pageX - that.options.imageTouchStartPosition[0],
                                    top: event.pageY - that.options.imageTouchStartPosition[1]
                                });
                            }

                            var idsArray = that._checkImageToCustomizer(event), customizer;
                            if (idsArray !== null) {
                                if (that.options.idsTouchArray !== null && (that.options.idsTouchArray.editorId != idsArray.editorId || that.options.idsTouchArray.customizerId != idsArray.customizerId)) {
                                    that.options.editors[that.options.idsTouchArray.editorId].options.customizers[that.options.idsTouchArray.customizerId].options.$grid.removeClass('qstickerEditor-gridDragover');
                                }

                                if (!that.options.idsTouchArray || (that.options.idsTouchArray.editorId != idsArray.editorId || that.options.idsTouchArray.customizerId != idsArray.customizerId)) {
                                    that.options.idsTouchArray = idsArray;
                                    that.options.editors[that.options.idsTouchArray.editorId].options.customizers[that.options.idsTouchArray.customizerId].options.$grid.addClass('qstickerEditor-gridDragover');
                                }
                            } else if (that.options.idsTouchArray !== null) {
                                that.options.editors[that.options.idsTouchArray.editorId].options.customizers[that.options.idsTouchArray.customizerId].options.$grid.removeClass('qstickerEditor-gridDragover');
                                that.options.idsTouchArray = null;
                            }
                        })
                        .on(that.events.current.mouseup + '.qstickerDragTouchImage', function(event) {
                            event.preventDefault();
                            if (that.options.isTouchScreen && event.originalEvent) {
                                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            }

                            $(window).off('.qstickerDragTouchImage');

                            if (that.options.idsTouchArray !== null) {
                                var customizer = that.options.editors[that.options.idsTouchArray.editorId].options.customizers[that.options.idsTouchArray.customizerId];
                                customizer.options.$grid.removeClass('qstickerEditor-gridDragover');
                                if (that.options.imageTouch) {
                                    customizer._addImage(that.options.imageTouch, that.options.imageTouchThumb, !customizer.settings.isBounceGrid);
                                }
                            }
                            that.options.idsTouchArray = null;
                            that.options.imageTouch = null;
                            that.options.imageTouchThumb = null;

                            if (that.options.$imageTouchClone) {
                                that.options.$imageTouchClone.remove();
                                that.options.$imageTouchClone = null;
                            }
                        });
                });
            };

            imageThumb.src = image;

            that.options.$imagesCarousel.width(that.options.images.length * that.options.view.imagesContainerHeight);
        };

        this._deleteImage = function(imageId) {
            that.options.images.splice(imageId, 1);
            that.options.$imagesCarousel.find('.imagesContainer-image[data-imageId="'+imageId+'"]').remove();

            var imageId = 0;
            that.options.$imagesCarousel.find('.imagesContainer-image').each(function() {
                $(this).attr('data-imageId', imageId.toString());
                imageId++;
            });

            that._resizeCarousel();

            if (that.options.images.length == 0) {
                that.options.$imagesContainer.find('#qstickerImagesCarousel').hide();
                that.options.$imagesContainer.find('#qstickerImagesUploaderSmall').hide();
                that.options.$imagesContainer.find('#qstickerImagesUploaderBig').show();
            }
        };

        this._resizeCarousel = function() {
            var width = that.options.images.length * that.options.view.imagesContainerHeight;
            that.options.$imagesCarousel.width(width);

            if (width > that.settings.$container.width() - that.options.arrowsWidth * 2) {
                var position = that.options.$imagesCarousel.position().left;
                position = Math.min(Math.max(-(width - (that.settings.$container.width() - that.options.arrowsWidth * 2)), position), 0);
                that.options.$imagesCarousel.css('left', position);
            } else {
                that.options.$imagesCarousel.css('left', 0);
            }
        };

        this._setSubmitEvents = function() {
            var editorId, editorsCount, editorsCounter, editorsIds = [];

            that.options.$submit.find('.button-submit').on(that.events.current.click, function(event) {

                event.preventDefault();

                that._showLoader('Пожалуйста, подождите');
                that._hideHints();
                that.settings.$container.hide();

                setTimeout(function() {
                    that.options.needResize = false;
                    $(window).on('resize.qstickerSubmit', function() {
                        that.options.needResize = true;
                    });

                    that.options.editorsImages = {};
                    that.options.imagesData = {};

                    editorsCount = _(that.options.editors).size();
                    editorsCounter = 0;

                    editorsIds = [];

                    for (editorId in that.options.editors) {
                        editorsIds.push(editorId);
                        that.options.editors[editorId]._exportImage(editorId, function(editorId, images) {
                            that.options.editorsImages[editorId] = images;

                            editorsCounter++;
                            if (editorsCounter == editorsCount) {
                                // изображения готовы
                                console.log(that.options.editorsImages);

                                // делаем картинку для продакта
                                that._makeProductSourceImage(editorsIds, function(image) {
                                    that.options.imagesData.productSource = image;

                                    var productsCounter = 0, productsCount = 2,
                                        onComplete = function(imageProduct, options) {
                                            that.options.imagesData[options.id] = imageProduct;
                                            productsCounter++;
                                            if (productsCounter == productsCount) {
                                                that._buildProductView();
                                            }
                                        };
                                    that._resizeImage(image, that.options.productImageThumbWidth, that.options.productImageThumbHeight, onComplete, {id: 'productThumb'});
                                    that._resizeImage(image, that.options.productImageIconWidth, that.options.productImageIconHeight, onComplete, {id: 'productIcon'});
                                });
                            }
                        });
                    }
                }, 100);
            });
        };

        this._makeProductSourceImage = function(editorsIds, onComplete) {
            var width = 0, height = 0, editorImageId, x = 0, y, editorCounterId;
            for (editorImageId in that.options.editorsImages) {
                width += that.options.editorsImages[editorImageId].product.width;
                height = Math.max(height, that.options.editorsImages[editorImageId].product.height);
            }

            var canvas = new Canvas(width, height),
                context = canvas.getContext('2d');

            context.clearRect(0, 0, width, height);

            for (editorCounterId in editorsIds) {
                editorImageId = editorsIds[editorCounterId];
                y = (height - that.options.editorsImages[editorImageId].product.height) / 2;
                context.drawImage(that.options.editorsImages[editorImageId].product, x, y, that.options.editorsImages[editorImageId].product.width, that.options.editorsImages[editorImageId].product.height);

                if (that.options.editorsImages[editorImageId].product.height < height) {
                    context.fillStyle = "#ffffff";
                    context.fillRect(x, 0, that.options.editorsImages[editorImageId].product.width, y);
                    context.fillRect(x, 0, that.options.editorsImages[editorImageId].product.width, that.options.editorsImages[editorImageId].product.height - y);
                }

                x += that.options.editorsImages[editorImageId].product.width;
            }

            var image = new Image();
            image.onload = function() {
                onComplete.call(this, image);
            };
            image.src = canvas.toDataURL('image/jpeg');
        };

        this._resizeImage = function(image, width, height, onComplete, options) {
            var zoom = (width / height > image.width / image.height) ? height / image.height : width / image.width,
                canvas = new Canvas(width, height),
                context = canvas.getContext('2d'),
                x = (width - image.width * zoom) / 2,
                y = (height - image.height * zoom) / 2;

            context.clearRect(0, 0, width, height);
            context.drawImage(image, x, y, image.width * zoom, image.height * zoom);

            var image = new Image();
            image.onload = function() {
                onComplete.call(this, image, options);
            };
            image.src = canvas.toDataURL();
        };

        this._buildProductView = function() {
            that.options.stage = 'final';

            that.settings.$container.hide();

            var productData = that.settings.productsData.productsInformation[that.options.productId];

            that.settings.$productContainer.html($('#template-qstickerFinalContainer').html());
            that.settings.$productContainer.find('.qstickerFinal-imageContainer .container-image').prepend(that.options.imagesData.productThumb);
            that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-title').html(productData.name);
            that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-information').html(productData.descriptionFull);

            that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-submit .input-price').html(productData.price).attr('data-price', productData.price);

            if (_(productData.options).size() > 0) {
                that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-options .container-imagesIcons')
                    .prepend(that.options.imagesData.productIcon)
                    .append('<span class="image-icon"><i class="icon-plus"></i></span>')
                    .append('<img src="' + that.settings.applicationUrl + that.options.membraneUrl + '" alt="" />');

                var optionsList = '<div class="list-options qstickerOptionsCheckboxes">', optionId, $optionsList;
                for (optionId in productData.options) {
                    optionsList += '<div><label class="checkbox" for="qstickerOptionCheckbox-'+optionId+'"><input type="checkbox" id="qstickerOptionCheckbox-'+optionId+'" class="qstickerOptionCheckbox" data-optionId="'+optionId+'" data-price="'+productData.options[optionId].price+'">'+productData.options[optionId].title+'</div>';
                }
                optionsList += '</div>';

                $optionsList = $(optionsList).appendTo(that.settings.$productContainer.find('.container-options .container-optionsDescription'));

                $optionsList.css({
                    'padding-top': (that.options.productImageIconHeight - 25 * _(productData.options).size()) / 2 - 10
                });

                var recalculatePrice = function() {
                    var price = parseInt(that.settings.productsData.productsInformation[that.options.productId].price),
                        $checkboxes = $optionsList.find('.qstickerOptionCheckbox:checked'), $checkbox;
                    if ($checkboxes.length > 0) {
                        $($checkboxes).each(function() {
                            price += parseInt($(this).attr('data-price'));
                        });
                    }

                    that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-submit .input-price').html(price.toString());
                };

                $optionsList.on('click', '.qstickerOptionCheckbox', recalculatePrice);

            } else {
                that.settings.$productContainer.find('.qstickerFinal-informationContainer .container-options').hide();
            }

            that.settings.$productContainer.find('.qstickerFinal-imageContainer .button-return').on(that.events.current.click, function(event) {
                event.preventDefault();
                that.settings.$productContainer.hide();
                that.settings.$container.show();

                that.options.stage = 'editor';

                $(window).off('.qstickerSubmit');
                if (that.options.needResize) {
                    that.resize(that.settings.height);
                }
            });

            that.settings.$productContainer.find('.qstickerFinal-informationContainer .button-order').on(that.events.current.click, function(event) {
                event.preventDefault();

                that._showLoader('Пожалуйста, подождите<br />Товар создается');

                setTimeout(function() {
                    var editorId, typeId, customizerId, imageCounter = 0,
                        sendData = {
                            images: {product: that.options.imagesData.productSource.src},
                            data: {}
                        };

                    for (editorId in that.options.editorsImages) {
                        for (typeId in that.options.editorsImages[editorId]) {
                            if (typeId == 'source') {
                                sendData.images[editorId + '-' + typeId] = that.options.editorsImages[editorId][typeId].src;
                            }
                            if (typeId == 'tech') {
                                sendData.images[editorId + '-forPrint'] = that.options.editorsImages[editorId][typeId].src;
                            }
                            if (typeId == 'screen') {
                                sendData.images.wallpaper = that.options.editorsImages[editorId][typeId].src;
                            }
                        }
                    }

                    sendData.data.colors = {};
                    for (editorId in that.options.editors) {
                        sendData.data.colors[editorId] = that.options.editors[editorId].options.color;
                        if (_(that.options.editors[editorId].options.customizers).size == 1) {
                            for (customizerId in that.options.editors[editorId].options.customizers) {
                                if (that.options.editors[editorId].options.customizers[customizerId].options.image) {
                                    imageCounter++;
                                    sendData.images['image' + '-' + imageCounter] = that.options.editors[editorId].options.customizers[customizerId].options.image;
                                }
                            }
                        }
                    }

                    sendData.data.productId = that.options.productId;

                    sendData.data.optionsIds = [];
                    var $checkboxes = that.settings.$productContainer.find('.qstickerOptionsCheckboxes .qstickerOptionCheckbox:checked');
                    if ($checkboxes.length > 0) {
                        $checkboxes.each(function() {
                            sendData.data.optionsIds.push($(this).attr('data-optionId'));
                        });
                    }

                    $.ajax({
                        url: that.settings.applicationUrl + that.options.submitUrl,
                        type: 'post',
                        dataType: 'json',
                        data: sendData,
                        success: function(json) {
                            if (json.status == 'error') {
                                that._hideLoader();
                                that._showLoader(json.message);
                            }
                            if (json.status == 'success') {
                                setTimeout(function() {
                                    document.location = json.productInStoreLink;
                                }, 1000);
                            }
                        }
                    });
                }, 100);
            });

            that.settings.$productContainer.show();
            that._hideLoader();
        };


        this._selectProduct = function(productId) {
            var editorId, productPictures = [], folderUrl, editor, gridId, $message;

            that._hideHint('choose');
            that._destroyIndexImage();

            if (productId != that.options.productId) {

                folderUrl = that.settings.productsData.products[productId].folderUrl;
                for (editorId in that.settings.productsData.products[productId].editors) {
                    editor = that.settings.productsData.products[productId].editors[editorId];
                    if (editor.mask) {
                        productPictures.push(folderUrl + editor.mask);
                    }
                    if (editor.overlay) {
                        productPictures.push(folderUrl + editor.overlay);
                    }
                    if (editor.editorOverlay) {
                        productPictures.push(folderUrl + editor.editorOverlay);
                    }
                    if (editor.productOverlay) {
                        productPictures.push(folderUrl + editor.productOverlay);
                    }
                    if (editor.grids) {
                        for (gridId in editor.grids) {
                            if (editor.grids[gridId].iconUrl) {
                                productPictures.push(folderUrl + editor.grids[gridId].iconUrl);
                            }
                        }
                    }
                }

                var loader = new PxLoader(), pictureId;

                for (pictureId in productPictures) {
                    loader.addImage(that.settings.applicationUrl + productPictures[pictureId]);
                }

                loader.addCompletionListener(function(event) {

                    if ($message) $message.remove();

                    that.options.$submitTitle.html(that.settings.productsData.productsInformation[productId].title);

                    if (that.options.stage == 'start') {

                        var $button = that.options.$submit.find('button');

                        setTimeout(function() {
                            $button.animate({opacity: 0.3}, 350, function() {
                                $button.animate({opacity: 1}, 350, function() {
                                    $button.animate({opacity: 0.3}, 350, function() {
                                        $button.animate({opacity: 1}, 350);
                                    });
                                });
                            });
                        }, 500);

                        that.options.$submit.css({
                            position: 'fixed',
                            left: that.settings.$sidebar.offset().left - that.options.view.marginSidebarRight,
                            top: that.options.view.submitTopPosition - that.options.view.marginTop,
                            'padding-top': that.options.view.marginTop,
                            'padding-left': that.options.view.marginSidebarRight,
                            'padding-right': that.options.view.marginSidebarRight,
                            'z-index': 20
                        }).width(that.options.sidebarWidth - that.options.view.marginSidebarRight).css({
                                'margin-top': 0
                            });

                        that.options.$submit.slideDown(400);

                        that._setSubmitEvents();
                    }

                    that.options.$list.css({'margin-top': that.options.view.submitContainerHeight});

                    if (productId != that.options.productId) {
                        that.options.productId = productId;
                        for (editorId in that.options.editors) {
                            that.options.editors[editorId].destroy();
                            delete that.options.editors[editorId];
                        }

                        that.options.stage = 'editor';

                        that.options.editors = {};
                        that.options.$editor.empty();

                        var product = that.settings.productsData.products[productId],
                            editorsCount = _(product.editors).size(),
                            width = (that.options.$editor.width() - that.options.view.editorHorizontalMargin * (editorsCount - 1)) / editorsCount,
                            height = that.options.$editor.height();

                        for (editorId in product.editors) {
                            var $editorContainer = $('<div class="qstickerEditor" data-editorId="'+editorId+'" style="float: left;"></div>').appendTo(that.options.$editor).width(width).height(height),
                                options = {
                                    width: width,
                                    height: height,
                                    $parent: $editorContainer,
                                    editor: product.editors[editorId],
                                    id: editorId,
                                    gridImageUrl: that.settings.applicationUrl + that.options.gridPictureUrl,
                                    folderUrl: product.folderUrl,
                                    applicationUrl: that.settings.applicationUrl,
                                    productsColors: that.settings.productsData.productsColors,
                                    application: that
                                };

                            if (_(that.options.editors).size() > 0) {
                                $editorContainer.css({'margin-left': that.options.view.editorHorizontalMargin});
                            }

                            that.options.editors[editorId] = new Editor();
                            that.options.editors[editorId].init(options);
                        }

                        that.options.$submitPrice.text(that.settings.productsData.productsInformation[productId].price);

                        that.options.$list.find('.button-selectProduct').removeClass('active');
                        that.options.$list.find('.button-selectProduct[data-productId="'+productId+'"]').addClass('active');
                    }

                    console.log(productId);
                });

                that.options.$editor.empty();
                var messageText = '<div>'+
                    '<div style="text-align: center; max-width: 150px; margin: 0 auto;">'+
                    '<div class="progress progress-striped active" style="margin: 40px 0 10px;">'+
                    '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>'+
                    '</div>'+
                    '</div>';
                messageText += '<div class="helper helper-medium" style="text-align: center; max-width: 300px; margin: 0 auto;text-align: center;">Пожалуйста, подождите</div>' + '</div>';

                $message = $(messageText).appendTo(that.options.$editor);
                $message.css('margin-top', that.options.$editor.height() / 2 - $message.height() / 2);

                loader.start();
            }
        };

        this._setFilesLoadEvent = function() {
            var $input = $('#qstickerOpenImage'),
                addFile = function(file) {
                    if (file.type.indexOf("image") == 0 && (file.type.indexOf("png") > 0 || file.type.indexOf("jpg") > 0 || file.type.indexOf("jpeg") > 0)) {
                        if (file.size <= 5 * 1024 * 1024) {
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                that._addImage(event.currentTarget.result);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            //$e.trigger('ajaxError', {errors: ['file_too_large']})
                        }
                    }
                },
                addDropableFile = function($element) {
                    $element.on('dragover dragleave', function (event) {
                        event.preventDefault();
                        return false;
                    }).on('drop', function (event) {
                        event.preventDefault();
                        var files = event.originalEvent.dataTransfer.files;
                        $.each(files, function (index, file) {
                            addFile(file);
                        });
                        that._hideUploadModal();
                    });
                },
                addDropableEvent = function($element) {
                    $element.on('change', function(event) {
                        var files = event.target.files;
//                        $element.replaceWith($element.clone(true));
                        $.each(files, function (index, file) {
//                            console.log(file.type);
                            addFile(file);
                        });
                        that._hideUploadModal();
                    });
                };

            addDropableEvent($input);

            $('#qstickerModalUpload').on('click', '.button-selectFile', function(event) {
                event.preventDefault();
                $input.trigger('click');
            });

            addDropableFile($('#qstickerModalUpload .area-dropFile'));
            addDropableFile(that.settings.$wrapper);
        };

        this._showLoader = function(message) {
            var width = $(window).width(),
                height = that.settings.$wrapper.height(),
                left = 0,
                top = that.settings.$wrapper.offset().top;

            that.options.loaderOverlay = $('<div id="qstickerLoaderOverlay"></div>').appendTo('body').css({
                position: 'fixed',
                width: width,
                height: height,
                top: top,
                left: left,
                'background-color': '#fff',
                'z-index': 9999
            });

            var messageText = '<div>'+
                    '<div style="text-align: center; max-width: 150px; margin: 0 auto;">'+
                        '<div class="progress progress-striped active" style="margin: 40px 0 10px;">'+
                            '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>'+
                        '</div>'+
                    '</div>';

            messageText += '<div class="helper helper-medium" style="text-align: center; max-width: 300px; margin: 0 auto;text-align: center;">'+message+'</div>' + '</div>';

            var $message = $(messageText).appendTo(that.options.loaderOverlay);
            $message.css('margin-top', that.options.loaderOverlay.height() / 2 - $message.height() / 2);
        };

        this._hideLoader = function() {
            that.options.loaderOverlay.remove();
        };

        this._buildProductList = function(productsList, productsTypes) {
            var typeId, productId, products, product, list = '', idSlide, idHide;

            list += '<div class="list-group list-group-no-bordered" style="margin-top: '+that.options.view.marginTop+'px; margin-right: '+that.options.view.marginSidebarRight+'px; padding-bottom: '+(that.options.view.imagesContainerHeight + that.options.view.imagesUploaderHeight)+'px;">';

            for (typeId in productsTypes) {
                products = productsTypes[typeId];

                idSlide = 'qsticker-slide-'+typeId;
                idHide = 'qsticker-hide-'+typeId;

                list += '<a href="#" class="list-group-item button-slide list-group-item-big" data-slide="#'+idSlide+'" data-toggle=".'+idHide+'" data-type="closed" data-id="'+typeId+'">'+products.title+'<i class="icon icon-chevron-right pull-right '+idHide+'"></i><i class="icon icon-chevron-down pull-right '+idHide+'" style="display: none;"></i></a>';
                list += '<div id="'+idSlide+'" style="display: none;">';

                for (productId in products.products) {
                    if (productsList[products.products[productId]]) {
                        product = productsList[products.products[productId]];
                        list += '<a href="#" class="list-group-item button-selectProduct" style="padding-left: 35px;" data-productId="'+products.products[productId]+'">'+product.name+'</a>';
                    }
                }

                list += '</div>';
            }

            list += '</div>';

            var $list = $('<div class="qsticker-ProductsListContainer">'+list+'</div>').appendTo(that.settings.$sidebar);

            $list.on('click', '.button-slide', function(event) {
                event.preventDefault();

                var $button = $(this), $openedButton = $list.find('.button-slide[data-type="opened"]'), id = $button.attr('data-id'), type = $button.attr('data-type'),openedId;

                if ($openedButton.length > 0) {
                    openedId = $openedButton.attr('data-id');
                    if (openedId != id) {
                        $($openedButton.attr('data-slide')).slideUp(350);
                        $($openedButton.attr('data-toggle')).toggle();
                        $openedButton.attr('data-type', 'closed');
                    }
                }

                $($button.attr('data-slide')).slideToggle(350);
                $($button.attr('data-toggle')).toggle();
                $button.attr('data-type', type == 'closed' ? 'opened' : 'closed');
            });

            $list.on('click', '.button-selectProduct', function(event) {
                event.preventDefault();
                var $button = $(this);

//                var $openedButton = $list.find('.button-slide[data-type="opened"]');
//
//                if ($openedButton.length > 0) {
//                    $($openedButton.attr('data-slide')).slideUp(350);
//                    $($openedButton.attr('data-toggle')).toggle();
//                    $openedButton.attr('data-type', 'closed');
//                }

                that._selectProduct($button.attr('data-productId'));
            });

            $list.find('.button-slide:eq(0)').trigger('click');

            that.options.$list = $list;
        };

        this._buildEditorContainer = function() {
            that.options.$editor = $('<div id="qstickerEditorContainer"></div>').appendTo(that.settings.$wrapper);
            that.options.$submit = $('<div id="qstickerSubmitContainer"></div>').prependTo(that.settings.$sidebar);

            that.options.$submit.html($('#template-qstickerSubmitContainer').html()).hide();
//            that.options.$editor.height(that.settings.height - that.options.view.imagesContainerHeight - that.options.view.imagesUploaderHeight - that.options.view.marginTop - that.options.view.marginBottom).css({'margin-top': that.options.view.marginTop, 'margin-bottom': that.options.view.marginBottom});
            that.options.$editor.height(that.settings.height - that.options.view.imagesContainerHeight - that.options.view.imagesUploaderHeight);

            that.options.$submitPrice = that.options.$submit.find('.input-price');
            that.options.$submitTitle = that.options.$submit.find('.qstickerSubmit-title');

            that.options.$submit.css({
                'margin-top': that.options.view.marginTop,
                'margin-right': that.options.view.marginSidebarRight
            });
        };

        this._buildImagesContainer = function() {
            that.options.$imagesContainer = $('<div id="qstickerImagesContainer"></div>').appendTo(that.settings.$wrapper);
            that.options.$imagesContainer
                .height(that.options.view.imagesContainerHeight + that.options.view.imagesUploaderHeight)
                .css({
                    position: 'fixed',
                    left: 0,
                    bottom: 0,
                    'width': $(window).width()
                })
                .append('<div id="qstickerImagesCarousel" style="display: none;"></div>')
                .append('<div id="qstickerImagesUploaderSmall" style="display: none;"></div>')
                .append('<div id="qstickerImagesUploaderBig"></div>');

            var $uploaderBig = that.options.$imagesContainer.find('#qstickerImagesUploaderBig'),
                $uploaderSmall = that.options.$imagesContainer.find('#qstickerImagesUploaderSmall'),
                $imagesCarousel = that.options.$imagesContainer.find('#qstickerImagesCarousel');

            $uploaderBig.html('<div class="helper helper-big">Загрузить новые фотографии:</div>' + $('#template-qstickerUploaderBig').html()).height(that.options.view.imagesContainerHeight + that.options.view.imagesUploaderHeight);
            $uploaderSmall.html('<div style="text-align: center;"><span class="helper helper-small" style="margin-right: 20px;">Загрузить еще фотографии:</span>' + $('#template-qstickerUploaderSmall').html() + '</div>').height(that.options.view.imagesUploaderHeight);
            $imagesCarousel.html('<div class="imagesContainer-wrapper"><div class="imagesContainer-content"></div></div><div class="imagesContainer-leftArrow"><i class="icon-chevron-left"></i></div><div class="imagesContainer-rightArrow"><i class="icon-chevron-right"></i></div>').height(that.options.view.imagesContainerHeight);

            var $helperBig = $uploaderBig.find('.helper'),
                $leftArrow = $imagesCarousel.find('.imagesContainer-leftArrow'),
                $rightArrow = $imagesCarousel.find('.imagesContainer-rightArrow');

            $helperBig.css('padding-top', that.options.view.imagesContainerHeight / 2 - $helperBig.height() / 2 - 15);
            $leftArrow.find('i').css({top: that.options.view.imagesContainerHeight / 2 - 10});
            $rightArrow.find('i').css({top: that.options.view.imagesContainerHeight / 2 - 10});

            $uploaderBig.find('.button-upload').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadModal();
            });
            $uploaderSmall.find('.button-upload').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadModal();
            });

            $uploaderBig.find('.button-upload-instagram').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadInstagramModal();
            });
            $uploaderSmall.find('.button-upload-instagram').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadInstagramModal();
            });

            $uploaderBig.find('.button-upload-vk').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadVkModal();
            });
            $uploaderSmall.find('.button-upload-vk').on(that.events.current.click, function(event) {
                event.preventDefault();
                that._showUploadVkModal();
            });

            that.options.$imagesCarousel = $imagesCarousel.find('.imagesContainer-content').css({'min-width': $(window).width() - that.options.arrowsWidth * 2});

            var imagesShiftInterval = null;

            $leftArrow.on(that.events.current.click, function(event) {
                event.preventDefault();
                that._shiftImagesCarousel('left');
            });

            $leftArrow.on(that.events.current.mousedown, function(event) {
                event.preventDefault();
                if (imagesShiftInterval) {
                    clearInterval(imagesShiftInterval);
                }
                imagesShiftInterval = setInterval(function() {
                    that._shiftImagesCarousel('left');
                }, 100);
                $(window).on(that.events.current.mouseup + '.qstickerImagesShiftInterval', function() {
                    if (imagesShiftInterval) {
                        clearInterval(imagesShiftInterval);
                    }
                    $(window).off('.qstickerImagesShiftInterval');
                });
            });

            $rightArrow.on(that.events.current.click, function(event) {
                event.preventDefault();
                that._shiftImagesCarousel('right');
            });

            $rightArrow.on(that.events.current.mousedown, function(event) {
                event.preventDefault();
                if (imagesShiftInterval) {
                    clearInterval(imagesShiftInterval);
                }
                imagesShiftInterval = setInterval(function() {
                    that._shiftImagesCarousel('right');
                }, 100);
                $(window).on(that.events.current.mouseup + '.qstickerImagesShiftInterval', function() {
                    if (imagesShiftInterval) {
                        clearInterval(imagesShiftInterval);
                    }
                    $(window).off('.qstickerImagesShiftInterval');
                });
            });
        };

        this._showUploadModal = function() {
            var $modal = $('#qstickerModalUpload'),
                height = parseInt($modal.attr('data-height'));
            $modal.css('top', ($(window).height() - height) / 2);
            $modal.modal({show: false}).modal('show');
        };

        this._hideUploadModal = function() {
            var $modal = $('#qstickerModalUpload');
            $modal.modal('hide');
        };

        this._calculateCheckboxes = function($dataContainer) {
            return $dataContainer.find('.qstickerPhotos-photosContainer .qstickerPhotos-photoItemCheckbox.checkbox-selected').length;
        };

        this._appendPhotos = function($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton, selectPhotosType, photos, isMoreAvailable, onLoadMore, compilePhotoTemplate) {
            var photoItemTemplate = _.template($('#template-qstickerPhotoItem').html()),
                photoContainerTemplate = _.template($('#template-qstickerPhotosContainer').html()),
                photosData = '', photoCounter, photoLastId = null, $containerMoreAvailable;

            for (photoCounter in photos) {
                photosData += compilePhotoTemplate(photoItemTemplate, photos[photoCounter]);
                photoLastId = photos[photoCounter].id;
            }

            $dataContainer.append(photoContainerTemplate({data: photosData}));

            $selectPhotosButton.off('click').on('click', function() {
                var photosSelector, photosSelectedCount;
                if (selectPhotosType == 'last') {
                    photosSelector = '.qstickerPhotos-photoItemCheckbox:gt('+(-(that.options.maxLoadPicturesCount + 1)).toString()+')';
                } else if (selectPhotosType == 'first') {
                    photosSelector = '.qstickerPhotos-photoItemCheckbox:lt('+(that.options.maxLoadPicturesCount).toString()+')';
                }

                console.log(photosSelector);

                $dataContainer.find('.qstickerPhotos-photoItemCheckbox').removeClass('checkbox-selected').addClass('checkbox-unselected');
                $dataContainer.find(photosSelector).addClass('checkbox-selected').removeClass('checkbox-unselected');

                photosSelectedCount = that._calculateCheckboxes($dataContainer);
                $loadCounterInput.text(photosSelectedCount.toString());

                if (photosSelectedCount == 0) {
                    $loadPhotosButton.attr('disabled', 'disabled');
                } else {
                    $loadPhotosButton.removeAttr('disabled');
                }
            });

            $dataContainer.find('.qstickerPhotos-photosContainer:last-child').on('click', '.qstickerPhotos-photoItem', function(event) {

                event.preventDefault();

                if (that.options.isLoadingPhotos) {
                    return;
                }

                var $photo = $(this),
                    id = $photo.attr('data-id'),
                    $checkbox = $photo.find('.qstickerPhotos-photoItemCheckbox'),
                    photosSelectedCount;

                $textPhotosLoadedStatus.hide();
                $textPhotosCounter.show();

                $selectPhotosButton.show();

                if ($checkbox.hasClass('checkbox-selected')) {
                    $checkbox.removeClass('checkbox-selected');
                    $checkbox.addClass('checkbox-unselected');
                } else {
                    if (that._calculateCheckboxes($dataContainer) < that.options.maxLoadPicturesCount) {
                        $checkbox.addClass('checkbox-selected');
                        $checkbox.removeClass('checkbox-unselected');
                    }
                }

                photosSelectedCount = that._calculateCheckboxes($dataContainer);
                $loadCounterInput.text(photosSelectedCount.toString());

                if (photosSelectedCount == 0) {
                    $loadPhotosButton.attr('disabled', 'disabled');
                } else {
                    $loadPhotosButton.removeAttr('disabled');
                }

                if (photosSelectedCount == that.options.maxLoadPicturesCount) {
                    setTimeout(function() {
                        $loadPhotosButton.animate({opacity: 0.3}, 250, function() {
                            $loadPhotosButton.animate({opacity: 1}, 250);
                        });
                    }, 10);
                }
            });

            if (that.options.isTouchScreen) {
                $dataContainer.find('.qstickerPhotos-photosContainer:last-child').css({
                    'margin-left': -8
                });
            }

            if (isMoreAvailable) {
                $dataContainer.append($('#template-qstickerPhotosLoadMore').html());
                $dataContainer.find('.qstickerPhotos-photosLoadMoreContainer .button-load').on(that.events.current.click, function(event) {
                    event.preventDefault();
                    onLoadMore($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, photoLastId);
                });
            }
        };

        this._showUploadInstagramModal = function(isCompleteAuthorization) {

            if (typeof isCompleteAuthorization == 'undefined') { isCompleteAuthorization = false; }

            var $modal = $('#qstickerModalInstagramUpload'),
                $modalBody = $modal.find('.modal-body'),
                $modalHeader = $modal.find('.modal-header'),
                $modalFooter = $modal.find('.modal-footer'),
                $modalLoginInput = $modalBody.find('.input-login-instagram'),
                height = $(window).height() - 40,
                $loadCounterInput = $modalFooter.find('.input-loadCounter'),
                $loadPhotosButton = $modalFooter.find('.button-loadPhotos'),
                $selectPhotosButton = $modalFooter.find('.button-selectFirstPhotos'),
                $textPhotosCounter = $modalFooter.find('.text-photosCounter'),
                $textPhotosLoadedCounter = $modalFooter.find('.text-photosLoadedCounter'),
                $textPhotosLoadedStatus = $modalFooter.find('.text-photosLoadedStatus'),
                $dataContainer = $modalBody.find('.container-data');

            $modal.height(height);
            $modal.css('top', ($(window).height() - height) / 2);
            $modalBody.css({
                'max-height': height - 65 - 60 - 40 - 74,
                'height': height - 65 - 60 - 40 - 74,
                'overflow-y': 'scroll'
            });

            $modalBody.off('scroll').on('scroll', function(event) {
                var $buttonLoad = $dataContainer.find('.qstickerPhotos-photosLoadMoreContainer .button-load');
                if ($buttonLoad.length > 0 && (($dataContainer.offset().top + $dataContainer.height() - ($modalBody.offset().top + $modalBody.height())) < 300)) {
                    $buttonLoad.triggerHandler(that.events.current.click);
                }
            });

            var authorizationParameters = that._parseQuery(document.location.hash);

            if (isCompleteAuthorization && authorizationParameters.access_token) {
                that.options.authorization = {
                    instagram: authorizationParameters
                };

                var $userContainer = $('<div class="qsticker-userContainer"></div>').prependTo($modalBody);

                var options = {
                    'provider': 'instagram',
                    'method': 'getUserInfo',
                    'accessToken': authorizationParameters.access_token
                };

                $.ajax({
                    url: that.settings.applicationUrl + 'php/proxy.php',
                    type: 'get',
                    data: options,
                    dataType: 'json',
                    beforeSend: function() {
                        that._showModalLoader($userContainer, 'Пожалуйста, подождите...');
                    },
                    success: function(json) {
                        var templateUserContainer = _.template($('#template-qstickerInstagramUserModalContainer').html());
                        $userContainer.html(templateUserContainer({
                            userName: json.user.data.username,
                            userImage: json.user.data.profile_picture
                        }));
                        that.options.authorization.instagram.follows = json.follows.data;
                        that.options.authorization.instagram.user = json.follows.user;

                        $userContainer.find('.button-logout').on(that.events.current.click, function(event) {
                            event.preventDefault();

                            var $iframe = $('<iframe width="0" height="0" style="display: none;" />').appendTo($userContainer);
                            $iframe.on('load', function() {
                                var options = {
                                        provider: 'instagram',
                                        action: 'completeAuthorization',
                                        login: $modalLoginInput.val()
                                    };
                                document.location = document.location.origin + '?' + $.param(options);
                            });
                            $iframe.attr('src', 'https://instagram.com/accounts/logout/');
                        });

                        if (isCompleteAuthorization && that.settings.getParameters && that.settings.getParameters.login) {
                            $modalLoginInput.val(that.settings.getParameters.login);
                            $modalBody.find('.button-load-instagram').trigger(that.events.current.click);
                        }
                    }
                });
            }

            var loadPhotos = function($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton) {
                    that.options.instagramLogin = $modalLoginInput.val();
                    if (that.options.instagramLogin) {
                        var options = {
                                'provider': 'instagram',
                                'method': 'getUserPhotos',
                                'login': that.options.instagramLogin
                            };
                        if (that.options.authorization && that.options.authorization.instagram) {
                            options.accessToken = that.options.authorization.instagram.access_token;

                            if (that.options.authorization.instagram.follows) {
                                var follows = that.options.authorization.instagram.follows,
                                    usersNames = _(follows).pluck('username'), userFollowId;
                                if ((userFollowId = usersNames.indexOf(that.options.instagramLogin)) >= 0) {
                                    options.userId = follows[userFollowId].id;
                                }
                            }
                            if (that.options.authorization.instagram.user && that.options.authorization.instagram.user.data && that.options.authorization.instagram.user.data.username == that.options.instagramLogin) {
                                options.userId = that.options.authorization.instagram.user.data.id;
                            }
                        }
                        $.ajax({
                            url: that.settings.applicationUrl + 'php/proxy.php',
                            type: 'get',
                            data: options,
                            dataType: 'json',
                            beforeSend: function() {
                                that._showModalLoader($dataContainer, 'Фотографии загружаются');
                            },
                            success: function(json) {
                                if (json && (json.status == 'ok' || (json.meta && json.meta.code == '200'))) {

                                    var photos = typeof json.data != 'undefined' ? json.data : json.items,
                                        isMoreAvailable = typeof json.more_available != 'undefined' ? json.more_available : (json.pagination && json.pagination.next_url);

                                    if ((!photos || photos.length == 0) && !isMoreAvailable) {
                                        that._showModalLoader($dataContainer, ':(<br />Фотографии пользователя скрыты<br />Для того, чтобы их просматривать,<br />необходима авторизация<br/><div class="button-authorize-container" style="text-align: center; margin-top: 20px;"><button type="button" class="btn btn-lg btn-warning button-authorize"><i class="icon-instagram" style="position: relative; top: 3px; margin-right: 6px;"></i> Авторизоваться</button></div>', false)
                                        var $buttonAuthorize = $dataContainer.find('.button-authorize');
                                        $buttonAuthorize.on(that.events.current.click, function(event) {
                                            event.preventDefault();
                                            document.location = that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'instagram', 'getAuthorizeUrl', that.options.authorization.instagram, $.extend({login: $modalLoginInput.val()}, that.settings.getParameters));
                                        });
                                    } else {
                                        $dataContainer.html('');

                                        var onLoadMore =  function($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, photoLastId) {
                                                var $containerMoreAvailable = $dataContainer.find('.qstickerPhotos-photosLoadMoreContainer');
                                                var options = {
                                                        'provider': 'instagram',
                                                        'method': 'getUserPhotos',
                                                        'login': that.options.instagramLogin,
                                                        'parameters': {
                                                            'max_id': photoLastId
                                                        }
                                                    };

                                                if (that.options.authorization && that.options.authorization.instagram) {
                                                    options.accessToken = that.options.authorization.instagram.access_token;

                                                    if (that.options.authorization.instagram.follows) {
                                                        var follows = that.options.authorization.instagram.follows,
                                                            usersNames = _(follows).pluck('username'), userFollowId;
                                                        if ((userFollowId = usersNames.indexOf(that.options.instagramLogin)) >= 0) {
                                                            options.userId = follows[userFollowId].id;
                                                        }
                                                    }
                                                    if (that.options.authorization.instagram.user && that.options.authorization.instagram.user.data && that.options.authorization.instagram.user.data.username == that.options.instagramLogin) {
                                                        options.userId = that.options.authorization.instagram.user.data.id;
                                                    }
                                                }

                                                // Подгрузка
                                                $.ajax({
                                                    url: that.settings.applicationUrl + 'php/proxy.php',
                                                    type: 'get',
                                                    data: options,
                                                    dataType: 'json',
                                                    beforeSend: function() {
                                                        that._showModalLoader($containerMoreAvailable, 'Фотографии загружаются');
                                                    },
                                                    success: function(json) {
                                                        if (json && (json.status == 'ok' || (json.meta && json.meta.code == '200'))) {

                                                            var photos = typeof json.data != 'undefined' ? json.data : json.items,
                                                                isMoreAvailable = typeof json.more_available != 'undefined' ? json.more_available : (json.pagination && json.pagination.next_url);

                                                            $containerMoreAvailable.remove();
                                                            that._appendPhotos($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton, 'first', photos, isMoreAvailable, onLoadMore, function(photoItemTemplate, photo) {
                                                                return photoItemTemplate({
                                                                    src: photo.images.thumbnail.url,
                                                                    id: photo.id,
                                                                    imageUrl: photo.images.standard_resolution.url
                                                                });
                                                            });
                                                        } else {
                                                            var message = '<div class="helper helper-medium" style="text-align: center;" style="margin: 40px 0 10px;">Произошла ошибка<br />Пожалуйста, повторите попытку позже</div>';
                                                            $dataContainer.append(message);
                                                        }
                                                    }
                                                });
                                            };

                                        that._appendPhotos($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton, 'first', photos, isMoreAvailable, onLoadMore, function(photoItemTemplate, photo) {
                                            return photoItemTemplate({
                                                src: photo.images.thumbnail.url,
                                                id: photo.id,
                                                imageUrl: photo.images.standard_resolution.url
                                            });
                                        });
                                    }

                                } else {
                                    var message = '<div class="helper helper-medium" style="text-align: center;" style="margin: 40px 0 10px;">Произошла ошибка<br />Пожалуйста, повторите попытку позже</div>';
                                    $dataContainer.html(message);
                                }
                            }
                        });
                    }
                };

            $modalBody.find('.button-load-instagram').off(that.events.current.click).on(that.events.current.click, function(event) {
                event.preventDefault();
                loadPhotos($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton);
            });
            $modalLoginInput.on('keypress', function(event) {
                if (event.which == 13 || event.keyCode == 13) {
                    loadPhotos($dataContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton);
                }
            });

            that._setLoadModalEvents($dataContainer, $loadPhotosButton, $textPhotosLoadedCounter, $textPhotosCounter, $textPhotosLoadedStatus, $loadCounterInput, $selectPhotosButton, 'instagram');

            $modal.on('shown.bs.modal', function () {
                $modalLoginInput.trigger('focus');

                if (isCompleteAuthorization && that.settings.getParameters && that.settings.getParameters.login) {
                    $modalLoginInput.val(that.settings.getParameters.login);
                }
            });
            $modal.modal({show: false}).modal('show');
        };

        this._loadImageFromUrl = function(imageUrl, onComplete, options) {
            $.ajax({
                url: that.settings.applicationUrl + 'php/proxy.php?method=getImage&imageUrl='+imageUrl,
                dataType: 'text',
                success: function(image) {
                    that._addImage(image);
                    if (onComplete && $.isFunction(onComplete)) {
                        onComplete.call(this, options);
                    }
                }
            });
        };

        this._hideUploadInstagramModal = function() {
            var $modal = $('#qstickerModalInstagramUpload');
            $modal.modal('hide');
        };

        this._setLoadModalEvents = function($dataContainer, $loadPhotosButton, $textPhotosLoadedCounter, $textPhotosCounter, $textPhotosLoadedStatus, $loadCounterInput, $selectPhotosButton, type) {
            $loadPhotosButton.on(that.events.current.click, function(event) {
                event.preventDefault();

                if ($loadPhotosButton.attr('disabled') == 'disabled') {
                    return;
                }

                var $checkboxes = $dataContainer.find('.qstickerPhotos-photosContainer .qstickerPhotos-photoItemCheckbox.checkbox-selected'),
                    checkboxesCount = $checkboxes.length, checkboxesCounter = 0;

                if (checkboxesCount > 0) {

                    that.options.isLoadingPhotos = true;

                    $loadPhotosButton.attr('disabled', 'disabled').text('Фотографии загружаются');

                    $textPhotosLoadedCounter.find('.input-loadedCounter').text('0');
                    $textPhotosLoadedCounter.find('.input-loadedCount').text(checkboxesCount.toString());

                    $textPhotosCounter.hide();
                    $textPhotosLoadedStatus.hide();
                    $textPhotosLoadedCounter.show();

                    $selectPhotosButton.hide();

                    $checkboxes.each(function() {

                        var $checkbox = $(this),
                            id = $checkbox.attr('data-id'),
                            imageUrl = $checkbox.attr('data-imageUrl');

                        that._loadImageFromUrl(imageUrl, function() {

                            $checkbox.removeClass('checkbox-selected');
                            $checkbox.addClass('checkbox-unselected');

                            checkboxesCounter++;
                            $textPhotosLoadedCounter.find('.input-loadedCounter').text(checkboxesCounter.toString());

                            if (checkboxesCounter == checkboxesCount) {
                                $loadCounterInput.text('0');

                                $textPhotosCounter.hide();
                                $textPhotosLoadedCounter.hide();
                                $textPhotosLoadedStatus.show().html('<span class="text-success">Фотографии успешно загружены</span>');

                                $loadPhotosButton.text('Загрузить фотографии');

                                that.options.isLoadingPhotos = false;
                            }
                        }, {type: type, id: id, $checkbox: $checkbox});
                    });
                }
            });
        };

        this._showModalLoader = function($dataContainer, text, showLoader) {

            if (typeof showLoader == 'undefined') { showLoader = true;}

            var message = '';

            if (showLoader) {
                message +=
                    '<div style="text-align: center; max-width: 150px; margin: 0 auto;">'+
                        '<div class="progress progress-striped active" style="margin: 40px 0 10px;">'+
                            '<div class="progress-bar"  role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>'+
                        '</div>'+
                    '</div>';
            }

            message += '<div class="helper helper-medium" style="text-align: center;">'+text+'</div>';

            $dataContainer.html(message);
        };

        this._showUploadVkModal = function(isCompleteAuthorization) {

            if (typeof isCompleteAuthorization == 'undefined') { isCompleteAuthorization = false; }

            var $modal = $('#qstickerModalVkUpload'),
                $modalBody = $modal.find('.modal-body'),
                $modalHeader = $modal.find('.modal-header'),
                $modalFooter = $modal.find('.modal-footer'),
                height = $(window).height() - 40,
                $buttonAuthorize = $modalBody.find('.button-authorize'),
                $loadCounterInput = $modalFooter.find('.input-loadCounter'),
                $loadPhotosButton = $modalFooter.find('.button-loadPhotos'),
                $selectPhotosButton = $modalFooter.find('.button-selectFirstPhotos'),
                $textPhotosCounter = $modalFooter.find('.text-photosCounter'),
                $textPhotosLoadedCounter = $modalFooter.find('.text-photosLoadedCounter'),
                $textPhotosLoadedStatus = $modalFooter.find('.text-photosLoadedStatus'),
                $dataContainer = $modalBody.find('.container-data');

            $modal.height(height);
            $modal.css('top', ($(window).height() - height) / 2);
            $modalBody.css({
                'max-height': height - 65 - 60 - 40 - 74,
                'height': height - 65 - 60 - 40 - 74,
                'overflow-y': 'scroll'
            });

            var authorizationParameters = that._parseQuery(document.location.hash)

            if (isCompleteAuthorization && authorizationParameters.access_token) {

                that.options.authorization = {
                    vk: authorizationParameters
                };

                var options = {
                        provider: 'vk',
                        method: 'getUserInfo',
                        userId: authorizationParameters.user_id,
                        accessToken: authorizationParameters.access_token
                    };

                that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'vk', 'getUserInfo', authorizationParameters,
                    {
                        beforeSend: function() {
                            that._showModalLoader($dataContainer, 'Пожалуйста, подождите');
                        }
                    }, function(json) {

                        var templateModalContent = _.template($('#template-qstickerVkModalContainer').html());

                        $dataContainer.html(templateModalContent({
                            userId: authorizationParameters.user_id,
                            userImage: json.user.response[0].photo_50,
                            userName: json.user.response[0].first_name + ' ' + json.user.response[0].last_name,
                            friends: json.friends.response.items,
                            albums: json.albums.response.items
                        }));

                        var $tabs = $dataContainer.find('#vk-modal-albums-tabs'),
                            $selectFriends = $dataContainer.find('.select-friends'),
                            $albumsFriendsContainer = $dataContainer.find('.container-friends-albums'),
                            $albumsContainer = $dataContainer.find('.container-my-albums'),
                            $photosContainer = $modalBody.find('.container-data-photos'),
                            $logoutButton = $modalBody.find('.button-logout');

                        that._setAlbumsVkEvents($modalBody, $albumsContainer, $photosContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton);

                        $tabs.on(that.events.current.click, 'a', function (event) {
                            event.preventDefault();
                            $(this).tab('show');
                            $selectFriends.chosen({no_results_text: "Друзей с таким именем не найдено"});
                        });

                        $selectFriends.on('change', function() {
                            var friendUserId = $(this).val();

                            if (parseInt(friendUserId) == 0) {
                                $albumsFriendsContainer.html('');
                                return;
                            }

                            options = {
                                provider: 'vk',
                                method: 'getUserAlbums',
                                userId: friendUserId,
                                accessToken: authorizationParameters.access_token
                            };

                            that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'vk', 'getUserAlbums', authorizationParameters,
                                {
                                    userId: friendUserId,
                                    beforeSend: function() {
                                        that._showModalLoader($albumsFriendsContainer, 'Пожалуйста, подождите');
                                    }
                                },
                                function(json) {
                                    var templateAlbumsContent = _.template($('#template-qstickerVkModalAlbumsContainer').html());
                                    $albumsFriendsContainer.html(templateAlbumsContent({
                                        userId: friendUserId,
                                        albums: json.response.items
                                    }));

                                    that._setAlbumsVkEvents($modalBody, $albumsFriendsContainer, $photosContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton);
                                });
                        });

                    $logoutButton.on(that.events.current.click, function(event) {
                        event.preventDefault();
                        document.location = that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'vk', 'getAuthorizeUrl');
                    });

                    // Загрузка фоток
                    that._setLoadModalEvents($photosContainer, $loadPhotosButton, $textPhotosLoadedCounter, $textPhotosCounter, $textPhotosLoadedStatus, $loadCounterInput, $selectPhotosButton, 'vk');
                });

            } else {
                $buttonAuthorize.on(that.events.current.click, function(event) {
                    event.preventDefault();
                    document.location = that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'vk', 'getAuthorizeUrl');
                });
            }

            $modal.modal({show: false}).modal('show');
        };

        this._setAlbumsVkEvents = function($modalBody, $albumsContainer, $photosContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton) {
            $albumsContainer.on('click', '.list-album-item', function(event) {
                event.preventDefault();

                var $listItem = $(this),
                    albumId = $listItem.attr('data-albumId'),
                    userId = $listItem.attr('data-userId');

                $listItem.parents('.list-group').find('.list-group-item').removeClass('active');
                $listItem.addClass('active');

                that.options.oAuthApi.send(that.settings.productsData.oAuthSettings, 'vk', 'getAlbumPhotos', that.options.authorization.vk,
                    {
                        userId: userId,
                        albumId: albumId,
                        beforeSend: function() {
                            that._showModalLoader($photosContainer, 'Фотографии загружаются');
                        }
                    },
                    function(json) {
                        if (json.response && json.response.items) {
                            if (json.response.items.length == 0) {
                                that._showModalLoader($photosContainer, ':(<br/>Альбом пустой', false);
                            } else {
                                var photos = json.response.items;
                                $photosContainer.html('');
                                that._appendPhotos($photosContainer, $loadCounterInput, $textPhotosCounter, $textPhotosLoadedStatus, $loadPhotosButton, $selectPhotosButton, 'first', photos, false, $.noop(), function(photoItemTemplate, photo) {
                                    var photoSmallId = 1, photoId, photoBigId = 2, photoBigWidth = 0;
                                    for (photoId in photo.sizes) {
                                        if (photo.sizes[photoId].width > photoBigWidth) {
                                            photoBigId = photoId;
                                            photoBigWidth = photo.sizes[photoId].width;
                                        }
                                        if (photo.sizes[photoId].type == 'm' || photo.sizes[photoId].type == 'o') {
                                            photoSmallId = photoId;
                                        }
                                    }
                                    return photoItemTemplate({
                                        src: photo.sizes[photoSmallId].src,
                                        id: photo.id,
                                        imageUrl: photo.sizes[photoBigId].src
                                    });
                                });

                                var $anchor = $modalBody.find('#anchor-photos-list');
                                $modalBody.animate({scrollTop: $anchor.offset().top - $modalBody.offset().top}, 150);
                            }
                        } else {
                            that._showModalLoader($photosContainer, ':(<br/>Ошибка доступа', false);
                        }
                    });
            });
        };

        this._hideUploadVkModal = function() {
            var $modal = $('#qstickerModalUpload');
            $modal.modal('hide');
        };

        this._parseQuery = function(query) {
            var pairs, i, keyValuePair, key, value, map = {};
            // remove leading question mark if its there
            if (query.slice(0, 1) === '?' || query.slice(0, 1) === '#') {
                query = query.slice(1);
            }
            if (query !== '') {
                pairs = query.split('&');
                for (i = 0; i < pairs.length; i += 1) {
                    keyValuePair = pairs[i].split('=');
                    key = decodeURIComponent(keyValuePair[0]);
                    value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
                    map[key] = value;
                }
            }
            return map;
        };

        this._shiftImagesCarousel = function(type) {
            if (that.options.$imagesCarousel.width() > that.settings.$container.width() - that.options.arrowsWidth * 2) {
                var position = that.options.$imagesCarousel.position().left + ((type == 'left' ? 1 : -1) * that.options.imagesShiftValue);
                position = Math.min(Math.max(-(that.options.$imagesCarousel.width() - (that.settings.$container.width() - that.options.arrowsWidth * 2)), position), 0);
                that.options.$imagesCarousel.css('left', position);
            }
        };

        this._setImagesBordersState = function(isShow) {
            var editorId, customizerId;
            for (editorId in that.options.editors) {
                for (customizerId in that.options.editors[editorId].options.customizers) {
                    that.options.editors[editorId].options.customizers[customizerId]._setImagesBordersState(isShow);
                }
            }
        };

        this._showCustomizerFrame = function(id) {
            var idParts = id.split('_'),
                editorId = idParts[0],
                customizerId = idParts[2];

            that.options.editors[editorId].options.customizers[customizerId]._showImagesBorders(id);
        };

        this._checkImageToCustomizer = function(event) {

            if (that.options.isTouchScreen && event.originalEvent) {
                event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
            }

            var editorId, customizerId, dragPosition;
            for (editorId in that.options.editors) {
                for (customizerId = that.options.editors[editorId].options.customizers.length - 1; customizerId >= 0; customizerId--) { // in that.options.editors[editorId].options.customizers) {
                    dragPosition = that.options.editors[editorId].options.customizers[customizerId].options.dragPosition;
                    if (event.pageX >= dragPosition[0][0] && event.pageX <= dragPosition[0][1] && event.pageY >= dragPosition[1][0] && event.pageY <= dragPosition[1][1]) {
                        return {
                            editorId: editorId,
                            customizerId: customizerId
                        };
                    }
                }
            }

            return null;
        };
    };

    return qSticker;
});
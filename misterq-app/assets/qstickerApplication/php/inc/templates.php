<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Igor Matyas (matyas.igor@gmail.com)
 * Date: Oct/24/13
 * Time: 2:44 AM
 */
?>
<script type="text/template" id="template-qstickerUploaderBig">
    <button class="btn btn-default button-upload"><i class="icon-uploadalt" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить с диска</button>
    <span style="margin: 0 10px;">или</span>
    <button class="btn btn-default button-upload-instagram btn-warning"><i class="icon-instagram" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить из Instagram</button>
    <span style="margin: 0 10px;">или</span>
    <button class="btn btn-default button-upload-vk btn-primary"><i class="icon-vk" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить из Вконтакте</button>
</script>

<script type="text/template" id="template-qstickerUploaderSmall">
    <button class="btn btn-default button-upload btn-sm"><i class="icon-uploadalt" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить с диска</button>
    <span style="margin: 0 10px; font-size: 12px; position: relative; top: 1px;">или</span>
    <button class="btn btn-default button-upload-instagram btn-warning btn-sm"><i class="icon-instagram" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить из Instagram</button>
    <span style="margin: 0 10px; font-size: 12px; position: relative; top: 1px;">или</span>
    <button class="btn btn-default button-upload-vk btn-primary btn-sm"><i class="icon-vk" style="position: relative; top: 2px; margin-right: 6px;"></i>Загрузить из Вконтакте</button>
</script>

<script type="text/template" id="template-qstickerSubmitContainer">
    <div class="qstickerSubmit-container" style="margin-bottom: 0;">
        <div class="qstickerSubmit-title"></div>
        <div class="qstickerSubmit-price"><span class="input-priceContainer" style="font-size: 14px;"><i class="icon-tagalt-pricealt" style="font-size: 14px; line-height: 14px; position: relative; top: 1px; margin-right: 3px;"></i> <span class="input-price" style="font-size: 20px;"></span> руб.</span></div>
        <div class="qstickerSubmit-button"><button class="btn btn-success button-submit btn-block" type="button">Перейти к оформлению <i class="icon-arrow-right" style="position: relative; top: 2px; margin-left: 3px;"></i></button></div>
    </div>
</script>

<script type="text/template" id="template-qstickerEditor">
    <div class="qstickerEditor-container">
        <div class="qstickerEditor-type" style="z-index: 5;">
            <span class="qstickerEditor-typeTitle">Сетка: <span class="qstickerEditor-typeGrid" style="z-index: 101;"></span></span>
        </div>
        <div class="qstickerEditor-type qstickerEditor-typeTop" style="z-index: 5;">
            <span class="qstickerEditor-typeTitle">Цвет: <span class="qstickerEditor-typeColor" style="z-index: 101;"></span></span>
        </div>
        <div class="qstickerEditor-action" style="z-index: 5;">
            <button class="btn btn-default btn-sm btn-block button-action qstickerEditor-actionReset" type="button" style="z-index: 101;"><i class="icon-refresh"></i> Заново</button>
            <button class="btn btn-default btn-sm btn-block button-action qstickerEditor-actionRandom" type="button" style="z-index: 101;"><i class="icon-random"></i> Случайно</button>
        </div>
        <div class="qstickerEditor-containerOverflow">
            <div class="qstickerEditor-underlay"></div>
            <canvas></canvas>
            <div class="qstickerEditor-canvasContainer"></div>
            <div class="qstickerEditor-overlay"></div>
            <div class="qstickerEditor-editorOverlay"></div>
            <div class="qstickerEditor-gridContainer"></div>
            <div class="qstickerEditor-imageContainer"></div>
        </div>
        <h4 class="qstickerEditor-caption"><%=title%></h4>
        <div class="qstickerEditor-zoom">
            <div class="btn-group-vertical">
                <button class="btn btn-default btn-sm button-zoom" data-type="plus"><i class="icon-plus"></i></button>
                <button class="btn btn-default btn-sm button-zoom" data-type="minus"><i class="icon-minus"></i></button>
            </div>
        </div>
    </div>
</script>

<script type="text/template" id="template-qstickerEditorFrame">
    <div class="qstickerEditor-imageBorder">
        <div class="qstickerEditor-imagePreview"></div>
        <div class="qstickerEditor-button qstickerEditor-buttonScale btn btn-default"><i class="icon-resize-full"></i></div>
        <div class="qstickerEditor-button qstickerEditor-buttonRotate btn btn-default"><i class="icon-repeat"></i></div>
        <div class="qstickerEditor-button qstickerEditor-buttonDelete btn-danger"><i class="icon-remove"></i></div>
    </div>
</script>

<script type="text/template" id="template-qstickerFinalContainer">
    <div class="qstickerFinal-imageContainer">
        <div class="container-image"></div>
        <div class="container-button" style="text-align: center;">
            <button type="button" class="btn btn-default button-return"><i class="icon-chevron-left"></i>Вернуться к редактированию</button>
        </div>
    </div>
    <div class="qstickerFinal-informationContainer">
        <h2><span class="container-title"></span></h2>
        <div class="container-information"></div>
        <div class="container-options">
            <div class="container-imagesIcons"></div>
            <div class="container-optionsDescription"></div>
        </div>
        <div class="container-submit">
            <div class="qstickerFinal-priceContainer" style="margin-right: 40px;">
                <span class="container-price" style="font-size: 14px;"><i class="icon-tagalt-pricealt" style="font-size: 24px; line-height: 14px; position: relative; top: 6px; margin-right: 5px;"></i> <span class="input-price" style="font-size: 20px;"></span> руб.</span>
                <button class="btn btn-success btn-lg button-order">Заказать</button>
            </div>
        </div>
    </div>
</script>

<div class="modal fade" id="qstickerModalUpload" role="dialog" data-height="410">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn btn-danger pull-right" data-dismiss="modal" aria-hidden="true">&times; &nbsp;&nbsp; Закрыть</button>
                <div class="clearfix"></div>
            </div>

            <div class="modal-body">
                <div class="helper-upload area-dropFile">Перетащите картинку в эту область</div>
                <div class="helper-upload-divider">или</div>
                <div class="helper-button"><button class="btn btn-default btn-lg button-selectFile"><i class="icon-uploadalt" style="position: relative; top: 2px; margin-right: 12px;"></i>Выберите картинку на диске</button></div>
            </div>

        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="qstickerModalInstagramUpload" role="dialog" style="max-height: 90%;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn btn-danger pull-right" data-dismiss="modal" aria-hidden="true">&times; &nbsp;&nbsp; Закрыть</button>
                <div class="clearfix"></div>
            </div>

            <div class="modal-body">
                <h4>Шаг 1: Выберите пользователя</h4>
                <div class="input-group" style="margin-bottom: 30px;">
                    <span class="input-group-addon"><i class="icon-instagram" style="position: relative; top: 1px;"></i></span>
                    <input type="text" class="form-control input-login-instagram" placeholder="Имя в Instagram">
                    <span class="input-group-btn">
                        <button class="btn btn-default btn-warning button-load-instagram" type="button">Показать фотографии</button>
                    </span>
                </div>

                <h4>Шаг 2: Выберите фотографии для загрузки</h4>
                <div class="container-data">
                    <div class="helper helper-medium" style="margin-top: 30px; text-align: center;"><i class="icon-images-gallery" style="position: relative; top: 1px; font-size: 40px;"></i><br />Фотографий пока нет</div>
                </div>
            </div>

            <div class="modal-footer" style="margin-top: 0;">
                <span class="pull-left"><button type="button" class="btn btn-sm btn-default button-selectFirstPhotos">Выбрать первые фотографии</button></span>
                <span class="btn-text text-photosCounter">Выбрано: <span class="input-loadCounter">0</span> из 40</span>
                <span class="btn-text text-photosLoadedCounter text-success" style="display: none;">Загружено фотографий: <span class="input-loadedCounter">0</span> из <span class="input-loadedCount">0</span></span>
                <span class="btn-text text-photosLoadedStatus" style="display: none;"></span>
                <button type="button" class="btn btn-primary button-loadPhotos" disabled="disabled">Загрузить фотографии</button>
            </div>

        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="qstickerModalVkUpload" role="dialog" style="max-height: 90%;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn btn-danger pull-right" data-dismiss="modal" aria-hidden="true">&times; &nbsp;&nbsp; Закрыть</button>
                <div class="clearfix"></div>
            </div>

            <div class="modal-body">
                <div class="container-data">
                    <div class="helper helper-big" style="text-align: center; margin-top: 30px;">Для того, чтобы загрузить фотографии,<br /> нужна авторизация на сайте</div>
                    <div class="button-authorize-container" style="text-align: center;">
                        <button type="button" class="btn btn-lg btn-primary button-authorize"><i class="icon-vk" style="position: relative; top: 3px; margin-right: 6px;"></i> Авторизоваться</button>
                    </div>
                </div>
            </div>

            <div class="modal-footer" style="margin-top: 0;">
                <span class="pull-left"><button type="button" class="btn btn-sm btn-default button-selectFirstPhotos">Выбрать первые фотографии</button></span>
                <span class="btn-text text-photosCounter">Выбрано: <span class="input-loadCounter">0</span> из 40</span>
                <span class="btn-text text-photosLoadedCounter text-success" style="display: none;">Загружено фотографий: <span class="input-loadedCounter">0</span> из <span class="input-loadedCount">0</span></span>
                <span class="btn-text text-photosLoadedStatus" style="display: none;"></span>
                <button type="button" class="btn btn-primary button-loadPhotos" disabled="disabled">Загрузить фотографии</button>
            </div>

        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<script type="text/template" id="template-qstickerInstagramUserModalContainer">
    <div class="user-container">
        <div class="user-image" style="background-image: url('<%=userImage%>'); margin-bottom: 15px;"></div>
        <span class="user-info"><span class="user-name lead"><%=userName%></span> <button class="btn btn-primary btn-sm button-logout" type="button"  style="position: relative; top: -4px; margin-left: 10px;">Выход</button></span>
    </div>
    <div class="clearfix"></div>
</script>

<script type="text/template" id="template-qstickerVkModalContainer">

<div class="user-container">
    <div class="user-image" style="background-image: url('<%=userImage%>'); margin-bottom: 15px;"></div>
    <span class="user-info"><span class="user-name lead"><%=userName%></span> <button class="btn btn-primary btn-sm button-logout" type="button"  style="position: relative; top: -4px; margin-left: 10px;">Выход</button></span>
</div>
<div class="clearfix"></div>

<h4>Шаг 1: Выберите альбом</h4>
<div class="input-group" style="margin-bottom: 30px;">

    <ul class="nav nav-tabs" id="vk-modal-albums-tabs">
        <li class="active"><a href="#vk-modal-albums-my">Мои альбомы</a></li>
        <li><a href="#vk-modal-albums-friends">Альбомы друзей</a></li>
    </ul>

    <div class="tab-content" style="margin-top: 15px;">
        <div class="tab-pane active" id="vk-modal-albums-my">
            <div class="container-my-albums">
                <div class="list-group list-albums">
                    <% _.each(albums, function(album) { %>
                    <a href="#" class="list-group-item list-album-item" data-albumId="<%=album.id%>"  data-userId="<%=userId%>" style="width: 535px;"><div class="album-image" style="background-image: url('<%=album.sizes[0].src%>')"></div> <span class="album-title"><%=album.title%> <span class="album-photosCounter">(Фотографий: <%=album.size%>)</span></a>
                    <% }); %>
                </div>
            </div>
        </div>
        <div class="tab-pane" id="vk-modal-albums-friends">
            <p style="margin-bottom: 5px;">Выберите друга:</p>
            <select class="select-friends" style="width: 300px;" data-placeholder="Выберите друга">
                <option value="0">– Не выбран –</option>
                <% _.each(friends, function(friend) { %>
                    <option value="<%=friend.id%>"><%=friend.first_name + ' ' + friend.last_name%></option>
                <% }); %>
            </select>

            <div class="container-friends-albums" style="margin-top: 15px;"></div>
        </div>
    </div>

</div>

<h4 id="anchor-photos-list">Шаг 2: Выберите фотографии для загрузки</h4>
<div class="container-data-photos">
    <div class="helper helper-medium" style="margin-top: 30px; margin-bottom: 30px; text-align: center;"><i class="icon-images-gallery" style="position: relative; top: 1px; font-size: 40px;"></i><br />Фотографий пока нет</div>
</div>
</script>

<script type="text/template" id="template-qstickerVkModalAlbumsContainer">
<div class="list-group list-albums">
    <% _.each(albums, function(album) { %>
    <a href="#" class="list-group-item list-album-item" data-albumId="<%=album.id%>" data-userId="<%=userId%>" style="width: 535px;"><div class="album-image" style="background-image: url('<%=album.sizes[0].src%>')"></div> <span class="album-title"><%=album.title%> <span class="album-photosCounter">(Фотографий: <%=album.size%>)</span></a>
    <% }); %>
</div>
</script>

<input type="file" multiple="multiple" accept="image/*" id="qstickerOpenImage" style="display: none">

<script type="text/template" id="template-qstickerPhotosLoadMore">
    <div class="qstickerPhotos-photosLoadMoreContainer">
        <button class="btn btn-default btn-lg button-load btn-block">Загрузить еще фотографии</button>
    </div>
</script>

<script type="text/template" id="template-qstickerPhotosContainer">
    <div class="qstickerPhotos-photosContainer"><%=data%></div>
</script>

<script type="text/template" id="template-qstickerPhotoItem">
    <div class="qstickerPhotos-photoItem" data-id="<%=id%>">
        <div class="qstickerPhotos-photoItemPreview" style="background-image: url(<%=src%>)" data-id="<%=id%>"></div>
        <div class="qstickerPhotos-photoItemCheckbox checkbox-unselected" data-type="unselected" data-id="<%=id%>" data-imageUrl="<%=imageUrl%>"><i class="text-checkbox icon-ok"></i></div>
    </div>
</script>

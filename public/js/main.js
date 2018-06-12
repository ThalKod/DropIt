const MAX_SIZE = 20;
const MAX_FILE = 1;

let uploaded = false;

const init = function(){
    if(document.getElementById("upload-window")){
        const uploader = new Dropzone("#upload-window",{
            url: "/upload",
            maxFiles: MAX_FILE,
            maxFilesize: MAX_SIZE, // in Mb
            previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n   <div class=\"dz-encrypting dz-status\"><i class=\"fa fa-spin fa-circle-o-notch\" aria-hidden=\"true\"></i> Storing...</div> <div class=\"dz-done dz-status\"><i class=\"fa fa-spin fa-circle-o-notch\" aria-hidden=\"true\"></i> Storing file...</div> <div class=\"dz-size\"><span id=\"data-dz-done\">0</span> / <span data-dz-size></span> \n </div>    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n    <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
        });

        uploader.on("sending", function(file) {
            $(".dropzone-outer").hide();
            $('.dz-done').hide();
            $(".dropzone-notification").slideDown();
        });

        uploader.on("queuecomplete", function() {
            if(!uploaded){
                $('.dz-error').hide();
                alert("File is too big");
                location.href = "/";
            }
        });
        
        uploader.on("uploadprogress", function(file, progress, bytesSent) {
            progress = bytesSent / file.size * 100;
            $('.dz-').hide();
            $('#uf-uploader').show();
            completed = 0;
            if (bytesSent < 1000000) {
                completed = ((bytesSent / 1000).toFixed(2) + "KB");
            }
            if (bytesSent > 1000000 && bytesSent < 1000000000) {
                completed = ((bytesSent / 1000000).toFixed(2) + "MB");
            }
            if (bytesSent > 1000000000) {
                completed = ((bytesSent / 1000000000).toFixed(3) + "GB");
            }
            uploaded = $("#data-dz-done");
            $(uploaded).html(completed);
            console.log(progress);
            if (progress >= 100) {
                $('.dz-size').hide();
                $('.dz-done').show();
            }
        });
    }
}

function chunksComplete(responseText) {
    uploaded = true;
    data = JSON.parse(responseText);
    document.querySelector('#copylink').value = location.href + data.url;
    $('#share-file').attr("data-url", data.url);
    $('#uf-uploader').hide();
    $('#edit').show();
    $('.intro-section').animate({
        padding: 0
    }, 750);
    $('.intro').animate({
        height: 0,
        margin: 0,
        opacity: 0
    }, 750);
    document.getElementsByClassName("intro").className = "hide";
    if (data.user_id === 0) {
        upload_promo();
    }

    $.ajax({
        method: "GET",
        url: "/count"
    })
    .done(function(data){
        $("#file-count").html("-"+data.data+"-");
    });
}
$(document).ready(function() {
    var clipboard = new Clipboard('.copy');
    clipboard.on('success', function(e) {
        e.clearSelection();
        showTooltip(e.trigger, 'Copied!');
    });
    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
        showTooltip(e.trigger, fallbackMessage(e.action));
    });
});
jQuery(window).load(function() {
    jQuery(".status").fadeOut();
    jQuery(".preloader").delay(1).fadeOut("fast");
})

function alturaMaxima() {
    var altura = $(window).height();
    $(".full-screen").css('min-height', altura);
}
$(document).ready(function() {
    alturaMaxima();
    $(window).bind('resize', alturaMaxima);
});
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'))
    document.querySelector('head').appendChild(msViewportStyle)
}

document.addEventListener("DOMContentLoaded", init);





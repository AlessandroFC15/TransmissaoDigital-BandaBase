/**
 * Created by acception on 9/8/16.
 */

var codificarCodigo = function () {

    var codigo = $('#codigoBinario').val();

    if (codigo.length == 0 || /[^01]/.test(codigo)) {
        $('.error-message').removeClass('invisible');
        return;
    } else {
        $('.error-message').addClass('invisible');
    }
};
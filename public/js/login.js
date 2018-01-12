// Модуль авторизации
var loginModule = (function (){

	var init = function(){
				console.log('Инициализация модуля loginModule');
				_setUpListners();
			},
			_setUpListners = function (){
				$('#login').on('submit', _submitForm); // отправка формы
			},
			_submitForm = function (ev) {
	      console.log('Работаем с формой');

	      ev.preventDefault();

	      var form = $(this),          
	          url = '/login',
	          defObject = _ajaxForm(form, url);

	      if (defObject) {
	        defObject.done(function(ans) {
	          var mes = ans.mes,
	              status = ans.status;

	          if ( status === 'OK'){
	            form.trigger('reset');
	            form.find('.success-mes').text(mes).show();           
	          } else{
	            form.find('.error-mes').text(mes).show();
	          }
	        });
	      }
	    },
	    _ajaxForm = function (form, url) {
      
	      if (!validation.validateForm(form)) return false;  // Возвращает false, если не проходит валидацию 
	      var data = form.serialize(); // собираем данные из формы в объект data

	      return $.ajax({ // Возвращает Deferred Object
	        type: 'POST',
	        url: url,
	        dataType : 'JSON',
	        data: data
	      }).fail( function(ans) {
	        console.log('Проблемы в PHP');
	        form.find('.error-mes').text('На сервере произошла ошибка').show();
	      });
	    };   

	return {
		init: init
	};

})();

if($('#login').length) {
  loginModule.init();
}

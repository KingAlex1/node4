// Модуль связаться со мной 
var contactMe = (function (){

	var init = function(){
				console.log('Инициализация модуля contactMe');
				_setUpListners();
			},
			_setUpListners = function (){
				$('#contact-me').on('submit', _submitForm); // отправка формы "связаться со мной"
			},
			_submitForm = function (ev) {
	      console.log('Работаем с формой связи');

	      ev.preventDefault();

	      var form = $(this),          
	          url = '/contact-me',
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

if($('#contact-me').length) {
  contactMe.init();
}

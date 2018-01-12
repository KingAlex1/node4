// Модуль добавления проекта
var addProject = (function (){

  var init = function(){
        console.log('Инициализация модуля addProject');
        _setUpListners();
      },
      _setUpListners = function (){
        $('#add-new-item').on('click', _showModal); // открыть модальное окно
        $('#add-new-project').on('submit', _addProject); // добавление проекта
      },
      _showModal = function (){
        console.log('Вызов модального окна');
        $('#new-progect-popup').bPopup({
          speed: 650,
          transition: 'slideDown',
          onClose: function () {
            this.find('.form').trigger("reset"); // сбрасываем форму
          }
        });
      };
      _addProject = function (ev){
        console.log('Работаем с формой добавления проекта');

        ev.preventDefault();

        var form = $(this),
            url = '/my-work',
            defObject = _ajaxForm(this, url);

        if (defObject) {
          defObject.done(function(ans) {
            var mes = ans.mes,
                status = ans.status;

            if ( status === 'OK'){
              form.trigger('reset');
              form.find('.success-mes').text(mes).show();
              // TODO: отрисовать новый элемент в DOM при помощи js шаблона
              location.reload(); // сразу перезагрузим страницу
            } else{
              form.find('.error-mes').text(mes).show();
            }
          });
        }      
      },
      _ajaxForm = function (form, url) {
      
        if (!validation.validateForm($(form))) return false;  // Возвращает false, если не проходит валидацию 
        var data = new FormData(form);  // собираем данные из формы в объект data

        return $.ajax({ // Возвращает Deferred Object
          type: 'POST',
          url: url,
          data: data,
          contentType: false,
          cache: false, 
          processData:false, 
        }).fail( function(ans) {
          console.log('Проблемы в PHP');
          form.find('.error-mes').text('На сервере произошла ошибка').show();
        });
      };   
  return {
    init: init
  };

})();

if($('#add-new-project').length) {
  addProject.init();
}

class Form {
    constructor() {
        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.setData = this.setData.bind(this);
        this.getData = this.getData.bind(this);
        document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
    }

    submit(event) {
        event.preventDefault();
        var validationResult = this.validate();
        var resultContainer = document.getElementById('resultContainer');
        var submitButton = document.getElementById('submitButton');

        resultContainer.className = '';
        resultContainer.innerHTML = '';

        for (var input of document.getElementsByTagName('input')) {
            input.classList.remove('error');
        }

        if (validationResult.isValid) {
            submitButton.disabled = true;
            var action = document.getElementById('myForm').action;

            var MyRequest = () => {
                return fetch(action)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        if (data.status === 'success') {
                            resultContainer.className = 'success';
                            resultContainer.innerHTML = 'Success';
                        } else if (data.status === 'error') {
                            resultContainer.className = 'error';
                            resultContainer.innerHTML = data.reason;
                        } else if (data.status === 'progress') {
                            resultContainer.className = 'progress';
                            setTimeout(() => {
                                MyRequest();
                            }, data.timeout);
                        }
                    })
                    .catch(alert);
            }
            MyRequest();
        } else {
            for (var value of validationResult.errorFields) {
                document.getElementById(value).className = 'error';
            }
        }
    }

    validate() {
        var isValid = true;
        var errorFields = [];

        var domainList = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        var domain = document.getElementById('email').value.replace(/.*@/, '');

        var fio = document.getElementById('fio').value;
        var fioLength = document.getElementById('fio').value.trim().split(/\s+/).length;
        var fioLengthMax = 3;

        var phone = document.getElementById('phone').value;
        var phonePattern = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
        var maxSumPhone = 30;

        if (!domainList.includes(domain)) {
            isValid = false;
            errorFields.push('email');
        }

        if (fioLength !== fioLengthMax || !/^[a-zA-Z а-яА-Я]*$/g.test(fio)) {
            isValid = false;
            errorFields.push('fio');
        }

        var sumDigits = (number) => {
            return number.match(/\d/g).reduce((a, b) => +a + +b);
        };

        if (phonePattern.test(phone)) {
            if (sumDigits(phone) >= maxSumPhone) {
                isValid = false;
                errorFields.push('phone');
            }
        } else {
            isValid = false;
            errorFields.push('phone');
        }

        return {
            isValid: isValid,
            errorFields: errorFields
        };
    }

    getData() {
        var data = {};
        var formInput = document.getElementById('myForm').getElementsByTagName('input');
        for (var key of formInput) {
            data[key.name] = key.value
        }
        return data;
    }

    setData(data) {
        for (var key in data) {
            if ((key === 'phone' || key === 'email' || key === 'fio')
                && document.getElementById('myForm').elements[key]) {
                document.getElementById('myForm').elements[key].value = data[key];
            }
        }
    }
}

var myForm = new Form();
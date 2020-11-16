function calculate() {
  var amount = document.getElementById('amount');
  var apr = document.getElementById('apr');
  var years = document.getElementById('years');
  var zipcode = document.getElementById('zipcode');
  var payment = document.getElementById('payment');
  var total = document.getElementById('total');
  var totalinterest = document.getElementById('totalinterest');

  // 사용자 데이터를 input 엘리먼트를 가져옴
  // 입력한 값은 모두 의도한 대로 입력되었다고 가정
  // 이자율을 백분율에서 십진수로 변환하고 연 이자율을 월 이자율로 변환
  // 상환 기간 연수를 월수로 변환
  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 / 12;
  var payments = parseFloat(years.value) * 12;

  // 월별 상환금 계산
  var x = Math.pow(1 + interest, payment);
  var monthly = (principal * x * interest) / (x - 1);

  if (isFinite(monthly)) {
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthly * payments).toFixed(2);

    save(amount.value, apr.value, years.value, zipcode.value);

    try {
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    } catch (e) {
      chart(principal, interest, monthly, payments);
    }
  } else {
    payments.innerHTML = "";
    total.innerHTML = "";
    totalinterest = "";
    chart();
  }
}

// 사용자가 입력한 데이터를 localStorage 객체의 프로퍼티에 저장
// 저장된 프로퍼티는 사용자가 추후에 방문 시 보여줌
// 이 스토리지 기능은 예제를 로컬에서 file:// URL로 실행할 경우,
// 파이어폭스를 비롯한 일부 브라우저에서 동작하지 않을 수 있음
// 하지만 HTTP로 실행시키면 정상적으로 작동
function save(amount, apr, years, zipcode) {
  if (window.localStorage) {
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}

// 문서의 로딩이 완료되었을 때, 과거에 사용자가 입력한 값이 있으면 복원
window.onload = function () {
  // 브라우저가 localStorage 기능을 지원하고, 과거에 저장한 데이터가 있으면
  if (window.localStorage && localStorage.loan_amount) {
    document.getElementById('amount').value = localStorage.loan_amount;
    document.getElementById('apr').value = localStorage.loan_apr;
    document.getElementById('years').value = localStorage.loan_years;
    document.getElementById('zipcode').value = localStorage.loan_zipcode;
  }
};

// 사용자가 입력한 값을 서버 측 스크립트에 전달하면, 서버 측에서는 사용자가 위치한 지역에서 대출이 가능한 대부업체 목록을 반환한다고 가정
// 이 예저는 실제로 대부업체를 찾아주는 서버스를 구현하고 있지 않지만 있다면 해당 서비스와 연결
function getLenders(amount, apr, years, zipcode) {
  // 브라우저가 XMLHttpRequest 객체를 지원하지 않으면 아무 일도 하지 않음
  if (!window.XMLHttpRequest) return;

  // 대부업체 목록을 출력한 엘리먼트를 찾음
  var ad = document.getElementById('lenders');
  if (!ad) return;

  // 사용자가 입력한 값을 URL에 질의 매개변수로 인코딩
  var url = 'getLenders.php' +
    '?amt=' + encodeURIComponent(amount) +
    '&apr=' + encodeURIComponent(apr) +
    '&yrs=' + encodeURIComponent(years) +
    '&zip=' + encodeURIComponent(zipcode);

  // XMLHttpRequest 객체를 사용해 앞에서 만든 URL을 통해 정보를 가져옴
  var req = new XMLHttpRequest();
  req.open('GET', url);
  req.send(null);

  // 서버로부터 응답을 받기 전에ㅡ 응답을 처리할 이벤트 핸들러 함수를 등록하게 됨
  // 이 이벤트 핸들러 함수는 일정 시간이 지난 후 서버에서 HTTP 응답이 오면 바로 호출
  // 이 같은 비동기 프로그래밍은 클라이언트 측 자바스크립트에서 매우 일반적
  req.onreadystatechange = function () {
    if (req.readyState == 4 && req.status == 200) {
      // 적합한 HTTP 응답을 받게됨
      var response = req.responseText;
      var lenders = JSON.parse(response);

      // 대부업체 정보가 담긴 배열을 HTML 문자열로 변환
      var list = "";
      for (var i = 0; i < lenders.length; i++) {
        list += "<li><a href='" + lenders[i].url + "'>" + lenders[i].name + "</a></li>";
      }
      ad.innerHTML = "<ul>" + list + "</ul>";
    }
  }
}

// 월별 대출 잔액, 이자, 자본, HTML<canvas> 엘리먼트 안에서 차트로 그림
// 만약 전달인자 없이 호출되면, 단순히 화면에 그려진 차트를 지움
function chart(principal, interest, monthly, payments) {
  var graph = document.getElementById('graph');
  graph.width = graph.width;

  // 만약에 전달인자 없이 호출되거나 브라우저가<canvas> 엘리머트를 지원하지 않으면 함수 종료
  if (arguments.length == 0 || !graph.getContext) return;

  // 드로잉 API를 제공하는 <canvas>에서 context 객체를 가져옴
  var g = graph.getContext("2d");
  var width = graph.width, height = graph.height;

  // 이 함수들은 각각 지불 연도와 달러를 픽셀로 변환
  function paymentToX(n) {
    return n * width / payments;
  }
  function amountToY(a) {
    return height - (a * height / (monthly * payments * 1.05));
  }

  //지불 선은 (0,0)에서 시작해 (payments, monthly*payments)까지 직선으로 표현
  g.moveTo(paymentToX(0), amountToY(0));
  g.lineTo(paymentToX(payments), amountToY(monthly * payments));
  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePath();
  g.fillStyle = "#f88";
  g.fill();
  g.font = "bold 12px sans-serif";
  g.fillText("Total Interest Payments", 20, 20);

  // 금액은 곡선으로 그리고 차트에 진하게 표시
  var equity = 0;
  g.beginPath();
  g.moveTo(paymentToX(0), amountToY(0));
  for (var p = 1; p <= payments; p++) {
    // 매번 납입할 때마다 이자가 얼마가 되는지 계산
    var thisMonthsInterest = (principal - equity) * interest;
    equity += (monthly = thisMonthsInterest);
    g.lineTo(paymentToX(p), amountToY(equity));
  }
  g.lineTo(paymentToX(payments), amountToY(0));
  g.closePath();
  g.fillStyle = 'green';
  g.fill();

  g.fillText("Total Equity", 20, 35);

  // 그리는 시작점을 원점으로 되돌림
  // 하지만 대출 잔액은 두꺼운 검은색으로 그림
  var bal = principal;
  g.beginPath();
  g.moveTo(paymentToX(0).amountToY(bal));
  for (var p = 1; p <= payments; p++) {
    var thisMonthsInterest = bal * interest;
    bal -= (monthly - thisMonthsInterest);
    g.lineTo(paymentToX(p), amountToY(bal));
  }
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = "black";
  g.fillText("Loan Balance", 20, 50);

  // 이제 X 축에 연도를 눈금 선으로
  g.textAlign = "center";

  var y = amountToY(0);
  for (var year = 1; year * 12 <= payments; year++) {
    var x = paymentToX(year * 12);
    g.fillRect(x - 0.5, y - 3, 1, 3);
    if (year == 1) {
      g.fillText("Year", x, y - 5);
    }
    if (year % 5 == 0 && year * 12 !== payments) {
      g.fillText(String(year), x, y - 5);
    }
  }

  g.textAlign = 'right';
  g.textBaseline = 'middle';

  var ticks = [monthly * payments, principal];
  var rightEdge = paymentToX(payments);
  for (var i = 0; i < ticks, length; i++) {
    var y = amountToY(ticks[i]);

    g.fillRect(rightEdge - 3, y - 0.5, 3, 1);
    g.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, y);
  }


}

class UPIDetails 
{
    constructor(payeeVPA, payeeName, amount, transactionNote, orderID)
    {
        this.payeeVPA = payeeVPA;
        this.payeeName = payeeName;
        this.amount = amount;
        this.transactionNote = transactionNote;
        this.orderID = orderID;    
    }
}

let upiDetails  = null;
let platform = getOS();

window.addEventListener('load', function() {

    // check platform
    if(platform == 'Android' || platform == 'iOS')
    {
        // good
        if(platform == 'iOS')
        {
            let dropdownMenu = '<label for="payApp">Select An app to Pay</label>'
						+ '<select name="payApps" id="payApps">'
						+	'<option value="gpay">Google Pay</option>'
						+	'<option value="amazonToAlipay">Amazon Pay</option>'
						+	'<option value="upi">BHIM UPI</option>'
						+	'<option value="mipay">Mi Pay</option>'
						+	'<option value="mobikwik">Mobikwik UPI</option>'
						+	'<option value="myairtelupi">My Airtel Pay</option>'
						+	'<option value="paytm">PayTM UPI</option>'
						+	'<option value="phonepe">PhonePe</option>'
						+	'<option value="sbiupi">SBI UPI</option>'						
						+  '</select>';

            this.document.getElementById('iosAppDropdown').innerHTML = dropdownMenu;

            payAppsDropdown = this.document.getElementById('payApps');
        }
    }
    else
    {
        this.document.getElementById('payNote').innerHTML = "This works only on your mobile, with UPI apps installed";
        this.document.getElementById('payButton').innerHTML = "";
        // alert("This works only on your mobile, with UPI apps installed");
        return;
    }

    // Get parameters in case platform is android or iOS
    if (window.location.search.indexOf('pa') > -1 && window.location.search.indexOf('pn') > -1
    && window.location.search.indexOf('am') > -1 && window.location.search.indexOf('tr') > -1) {

        // load UPI details
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const pn = urlParams.get('pn');
        const pa = urlParams.get('pa');
        const am = urlParams.get('am');
        // const tn = urlParams.get('tn');
        const ordid = urlParams.get('tr');

        // Set upi details for use
        upiDetails = new UPIDetails(pa, pn, am, ordid, ordid);

        // Set the payment note
        this.document.getElementById('payNote').innerHTML = pn + " has requested ???" + am;

        // Set pay button href
        this.document.getElementById('pay').setAttribute('href', GetUPILink());

    } else {
        this.document.getElementById('payNote').innerHTML = "This link is invalid!";
        this.document.getElementById('payButton').innerHTML = "";        
    }
});

this.document.getElementById('pay').addEventListener('click', function() {
    window.location.replace(GetUPILink());
});

// Function to pay by opening respective app on platforms
function GetUPILink() 
{
    let upiLink = null;
    let queryLink = "pay?pa=" + upiDetails.payeeVPA 
                    + "&pn=" + upiDetails.payeeName
                    + "&am=" + upiDetails.amount
                    + "&cu=INR"
                    + "&tn=" + upiDetails.transactionNote
                    + "&tr=" + upiDetails.orderID;

    if(platform == 'Android' || platform == 'iOS') // need to remove iOS
    {
        upiLink = "upi://" + queryLink;
        return upiLink;
    }    

    if(platform == 'iOS')
    {
        let selectedApp = document.getElementById('payApps').value;
        upiLink = selectedApp + queryLink;
        return upiLink;
    }
}

function getOS() {

    var userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }
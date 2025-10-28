$(document).ready(function () {
    function loadPage(page) {
        $('#mainContent').empty().load(page);
    }

    function setActiveLink(linkElement) {
        $('.sidebar .nav-link').removeClass('active');
        $(linkElement).addClass('active');
    }

    $('#itemManagementLink').click(function (e) {
        e.preventDefault();
        setActiveLink(this);
        initForm();
        loadPage('./pages/product_management.html');
    });

    $('#inwardManagementLink').click(function (e) {
        e.preventDefault();
        setActiveLink(this);
        initForm();
        loadPage('./pages/receive_management.html');
    });

    $('#outwardManagementLink').click(function (e) {
        e.preventDefault();
        setActiveLink(this);
        initForm();
        loadPage('./pages/dispatch_management.html');
    });

    $('#reportPageLink').click(function (e) {
        e.preventDefault();
        setActiveLink(this);
        initForm();
        loadPage('./pages/summary_page.html');
    });

    $('#itemManagementLink').trigger('click');

});

function initForm() {
    localStorage.removeItem('item_rec');
    localStorage.removeItem('rec');
    localStorage.removeItem('out_rec');
}
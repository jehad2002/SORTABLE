document.addEventListener('DOMContentLoaded', () => { // اضافه مستمع عند تحميل المحتوي 
    const pageSizeSelect = document.getElementById('pageSize');
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('heroesBody');
    const paginationDiv = document.getElementById('pagination');
    let heroesData = []; 
    let currentPage = 1; //  هذا المتغير يتتبع الصفحة الحالية التي يتم عرضها. يبدأ من 1 لأن التصفح عبر الصفحات يبدأ عادة من الصفحة رقم 1.
    let pageSize = parseInt(pageSizeSelect.value) || 20; // هذا يحدد عدد العناصر التي سيتم عرضها على كل صفحة.


    //الكود التالي يقوم بجلب البيانات من اي بي ااااي ا
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
        .then(response => response.json()) // يحلل الاستجابة من (جيسون) إلى  جافا سكريبت
        .then(data => {
            heroesData = data; // تعيين البيانات المسترجعة من الـ اي بي ااااي 
            renderTable(); //  لعرض البيانات في جدول. بعد تحميل البيانات
            renderPagination(); // لإنشاء عناصر التصفح، مما يسمح للمستخدمين بالانتقال بين صفحات البيانات.
        })
        .catch(console.error); // يساعد في اكتشاف الأخطاء أثناء التطوير والتشغيل


    function renderTable() { //  هذه الدالة تُستخدم لعرض البيانات في الجدول بناءً على الصفحة الحالية وحجم الصفحة المحدد.
        const filteredData = heroesData.filter(hero =>   //يقوم هذا السطر بتصفية بيانات الأبطال بناءً على النص الذي أدخله المستخدم في حقل البحث
            hero.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );

        const isAll = pageSize === 'all';
        const paginatedData = isAll ? filteredData 
            : filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize); //   بداية و نهاية الجدول 
        tableBody.innerHTML = paginatedData.map(hero => ` 
            <tr>
                <td><img src="${hero.images.xs}" alt="${hero.name}" class="hero-icon"></td>
                <td><a href="hero-details.html?name=${encodeURIComponent(hero.name)}">${hero.name}</a></td>
                <td>${hero.biography.fullName}</td>
                <td>${hero.powerstats.intelligence}</td>
                <td>${hero.powerstats.strength}</td>
                <td>${hero.appearance.race}</td>
                <td>${hero.appearance.gender}</td>
                <td>${hero.appearance.height[0]}</td>
                <td>${hero.appearance.weight[0]}</td>
                <td>${hero.biography.placeOfBirth}</td>
                <td>${hero.biography.alignment}</td>
            </tr>
        `).join('');
        // تحديث محتوي الجدول
        if (isAll) {
            paginationDiv.style.display = 'none'; // Hide pagination if 'All' is selected
        } else {
            paginationDiv.style.display = 'block'; // Show pagination otherwise
        }
    }
  // رسم عناصر التحكم في الصفحات
function renderPagination() {
    // حساب إجمالي عدد العناصر بعد تصفية البحث
    const totalItems = heroesData.filter(hero =>
        hero.name.toLowerCase().includes(searchInput.value.toLowerCase())
    ).length;
    
    // إذا كان حجم الصفحة 'all'، نتجنب رسم عناصر التحكم في الصفحات
    if (pageSize === 'all') {
        paginationDiv.innerHTML = '';
        return;
    }
    
    // حساب إجمالي عدد الصفحات
    const totalPages = Math.ceil(totalItems / pageSize);
    
    // رسم أزرار الصفحات
    paginationDiv.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <button class="${i + 1 === currentPage ? 'active' : ''}">${i + 1}</button>
    `).join('');
    
    // إضافة مستمعي الأحداث لكل زر
    paginationDiv.querySelectorAll('button').forEach((button, i) => {
        button.addEventListener('click', () => {
            currentPage = i + 1;
            renderTable(); // تحديث جدول العرض بناءً على الصفحة الحالية
            updatePagination(); // تحديث حالة أزرار التنقل
        });
    });
}

// تحديث حالة أزرار التنقل بناءً على الصفحة الحالية
function updatePagination() {
    paginationDiv.querySelectorAll('button').forEach((button, i) => {
        button.classList.toggle('active', i + 1 === currentPage);
    });
}

// الاستماع لتغييرات حجم الصفحة
pageSizeSelect.addEventListener('change', () => {
    pageSize = pageSizeSelect.value; // تخزين حجم الصفحة كقيمة نصية
    currentPage = 1; // إعادة تعيين الصفحة الحالية إلى 1
    renderTable(); // تحديث جدول العرض
    renderPagination(); // إعادة رسم عناصر التحكم في الصفحات
});

// الاستماع لتغييرات في إدخال البحث
searchInput.addEventListener('input', () => {
    currentPage = 1; // إعادة تعيين الصفحة الحالية إلى 1
    renderTable(); // تحديث جدول العرض
    renderPagination(); // إعادة رسم عناصر التحكم في الصفحات
});

// إعداد أولي
renderTable(); // عرض الجدول الأولي
renderPagination(); // عرض عناصر التحكم في الصفحات الأولية
  });
  

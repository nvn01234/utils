var RegistrationTool = function() {
    this.rowIndexMap = {};

    this.disableBlockUI = function() {
        App.blockUI = function() {}
    };

    this.enableRegistration = function() {
        $registrationAvailable = true;
    };

    this.disableCheckConflict = function() {
        this.CheckConflict = CheckConflict; // backup
        CheckConflict = function() {}
    };

    this.enableCheckConflict = function() {
        CheckConflict = this.CheckConflict;
    };

    this.init = function() {
        this.enableRegistration();
        this.disableCheckConflict();
        DSDK(2);
        this.disableBlockUI();
    };

    this.abortAll = function() {
        $(".abort").each(function(i, e) {
            var t = $(e).data('rowindex');
            Abort(t);
        });
        this.RegisteredSubject();
    };
    this.standardCode = function(code) {
        code = code.replace(/^[^A-Z]*([A-Z]+) ?(\d+)( (\d+))?(.|\n)*$/, "$1$2$3");
        return code;
    };
    this.RegisteredSubject = function() {
        RegisteredSubject();
        $n && $n.close();
    };

    this.findRowIndexMap = function() {
        var $this = this;
        $(".order").each(function(i, e) {
            var rowindex = $(e).data("rowindex");
            var code = $(e).closest("tr").find("td:eq(4)").text().trim();
            $this.rowIndexMap[$this.standardCode(code)] = rowindex;
        });
        return JSON.stringify(this.rowIndexMap);
    };

    this.subjects = [];
    this.interval = null;

    this.registerSubject = function(code) {
        this.registerSubjects([code]);
    };

    this.registerSubjects = function(codes) {
        this.subjects = codes;
        this.loop();
    };

    this.loop = function() {
        var $this = this;
        if ($this.interval !== null) {
            window.clearInterval($this.interval);
        }
        this.interval = window.setInterval(function () {
            $this.subjects.forEach(function(code) {
                var rowindex = $this.rowIndexMap[$this.standardCode(code)];
                if (rowindex !== undefined) {
                    Pending(rowindex);
                }
            });
            $this.RegisteredSubject();
            $this.submit();
        }, 500);
    };

    this.submit = function() {
        function n(n) {
            console.log(n.message);
            $n && $n.close();
            DSDK(2);
        }
        var t = "/xac-nhan-dang-ky/" + $registrationMode;
        ajaxRequest("POST", t, "json", n, null, null, !0);
    };

    this.stop = function() {
        window.clearInterval(this.interval);
        this.interval = null;
    }
};

// Usage:
//
// var tool = new RegistrationTool();
// tool.init(); // init tool
//
// tool.findRowIndexMap(); // lấy ra danh sách row, hoặc:
// tool.rowIndexMap = {...}; // assign map đã tìm sẵn
//
// tool.abortAll(); // xoá tất cả các môn đã đăng ký
//
// var codes = ["INT2204 1", "INT2205 2"];
// tool.registerSubjects(codes); // đăng ký nhiều môn, loop
//
// var code = "INT2204 1";
// tool.registerSubject(code); // đăng ký 1 môn, loop
//
// tool.stop(); // dừng loop

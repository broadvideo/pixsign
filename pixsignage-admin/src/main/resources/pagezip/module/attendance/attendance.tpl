<script class="attendance-tpl" type="text/x-dot-template">
    <div class="attendance-list">
        {{~it:student:index}}
        <div class="attendance-item animated" data-id="{{=student.id}}">
            <div class="attendance-avatar">
                <img src="{{=student.avatar}}" class="opacity"/>
            </div>
            <div class="attendance-info">
                <p>签到时间：{{=moment().format('YYYY-MM-DD HH:mm:ss')}}</p>
            </div>
        </div>
        {{~}}
    </div>
</script>
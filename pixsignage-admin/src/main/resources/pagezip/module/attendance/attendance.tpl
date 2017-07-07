<script class="attendance-tpl" type="text/x-dot-template">
    <div class="attendance-list">
        {{~it:student:index}}
        <div class="attendance-item animated" data-id="{{=student.id}}">
            <div class="attendance-avatar">
                <img src="{{=student.avatar}}" class="opacity"/>
            </div>
            <div class="attendance-info">
                <p>{{=student.name}}</p>
            </div>
        </div>
        {{~}}
    </div>
</script>
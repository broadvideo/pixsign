<script class="home-school-tpl" type="text/x-dot-template">
    <table class="home-school-table">
        <tbody>
        {{~it:message:index}}
        <tr class="home-school-tr">
            <td class="home-school-avatar">
                <img src="{{=message.headimgurl}}"/>
            </td>
            <td class="home-school-name">
                <span>{{=message.name}}</span>
            </td>
            <td class="home-school-message">
                {{? message.message_info}}
                <span>{{=message.message_info}}</span>
                {{?}}
                {{? message.mp3_file}}
                <audio src="{{=message.mp3_file}}" controls=controls></audio>
                {{?}}
            </td>
            <td class="home-school-ts">
                <span>{{=message.send_time}}</span>
            </td>
        </tr>
        {{~}}
        </tbody>
    </table>
</script>
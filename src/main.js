import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.use(router);
app.config.globalProperties.$swal = Swal;

app.mount('#app');

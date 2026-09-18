const AdminCommon = (() => {
 
    const CLAVE_PRODUCTOS = 'gv_admin_productos';
    const CLAVE_USUARIOS = 'gv_admin_usuarios';
 
    const productosPorDefecto = [
        { id: 'elden-ring', nombre: 'Elden Ring', descripcion: 'Edición estándar - Clave digital Steam.', precio: 29990, precioAnterior: null, stock: 42, img: 'img/producto_juego1.jpg' },
        { id: 'cyberpunk-2077', nombre: 'Cyberpunk 2077', descripcion: 'Edición completa - Clave digital Steam.', precio: 19990, precioAnterior: 34990, stock: 15, img: 'img/producto_juego2.jpg' },
        { id: 'ea-fc-26', nombre: 'EA Sports FC 26', descripcion: 'Edición estándar - Clave digital Steam.', precio: 44990, precioAnterior: null, stock: 8, img: 'img/producto_juego3.jpg' },
        { id: 'baldurs-gate-3', nombre: "Baldur's Gate 3", descripcion: 'Edición estándar - Clave digital Steam.', precio: 27990, precioAnterior: null, stock: 27, img: 'img/producto_juego4.jpg' },
        { id: 'gta-v', nombre: 'Grand Theft Auto V', descripcion: 'Edición Premium - Clave digital Steam.', precio: 14990, precioAnterior: null, stock: 60, img: 'img/producto_juego5.jpg' },
        { id: 'hades-2', nombre: 'Hades II', descripcion: 'Edición estándar - Clave digital Steam.', precio: 18990, precioAnterior: null, stock: 33, img: 'img/producto_juego6.jpg' },
        { id: 'red-dead-2', nombre: 'Red Dead Redemption 2', descripcion: 'Edición estándar - Clave digital Steam.', precio: 24990, precioAnterior: null, stock: 19, img: 'img/producto_juego7.jpg' },
        { id: 'minecraft', nombre: 'Minecraft', descripcion: 'Edición Java + Bedrock.', precio: 12990, precioAnterior: null, stock: 75, img: 'img/producto_juego8.jpg' }
    ];
 
    const usuariosPorDefecto = [
        { id: 'u1', nombre: 'Camila Rojas', correo: 'camila.rojas@ejemplo.com', telefono: '+56911111111', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', estado: 'activo' },
        { id: 'u2', nombre: 'Benjamín Soto', correo: 'bsoto@ejemplo.com', telefono: '', region: 'Región de Valparaíso', comuna: 'Viña del Mar', estado: 'activo' },
        { id: 'u3', nombre: 'Javiera Muñoz', correo: 'jmunoz@ejemplo.com', telefono: '+56933333333', region: 'Región del Biobío', comuna: 'Concepción', estado: 'inactivo' }
    ];
 
    const regiones = {
        'Región Metropolitana de Santiago': ['Santiago', 'Isla de Maipo', 'Puente Alto', 'Maipú'],
        'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
        'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles']
    };
 
    /* ---------- SESIÓN ---------- */
 
    // Redirige a login.html si no hay sesión de administrador activa.
    // Devuelve el objeto de sesión (correo, inicio) si todo está bien.
    const requireAdminSession = () => {
        const raw = sessionStorage.getItem('sesionAdministrador');
        if (!raw) {
            window.location.href = 'login.html';
            return null;
        }
        return JSON.parse(raw);
    };
 
    // Conecta el botón "Cerrar sesión", el modal de confirmación y el toast.
    // Espera encontrar en la página: #btnCerrarSesion, #modalConfirmarSalida,
    // #btnCancelarSalida, #btnConfirmarSalida y #toastSesion.
    const setupLogout = () => {
        const btn = document.getElementById('btnCerrarSesion');
        const modal = document.getElementById('modalConfirmarSalida');
        if (!btn || !modal) return;
 
        btn.addEventListener('click', () => modal.classList.add('activo'));
 
        document.getElementById('btnCancelarSalida').addEventListener('click', () => {
            modal.classList.remove('activo');
        });
 
        document.getElementById('btnConfirmarSalida').addEventListener('click', () => {
            sessionStorage.removeItem('sesionAdministrador');
            modal.classList.remove('activo');
 
            const toast = document.getElementById('toastSesion');
            toast.classList.add('mostrar');
 
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 900);
        });
 
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('activo');
        });
    };
 
    /* ---------- FORMATO ---------- */
 
    const formatoCLP = (valor) => '$' + Number(valor).toLocaleString('es-CL');
 
    /* ---------- PRODUCTOS ---------- */
 
    const cargarProductos = () => {
        try {
            const guardado = localStorage.getItem(CLAVE_PRODUCTOS);
            return guardado ? JSON.parse(guardado) : productosPorDefecto.slice();
        } catch (e) {
            return productosPorDefecto.slice();
        }
    };
 
    const guardarProductos = (lista) => {
        try { localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista)); } catch (e) { /* almacenamiento no disponible */ }
    };
 
    /* ---------- USUARIOS ---------- */
 
    const cargarUsuarios = () => {
        try {
            const guardado = localStorage.getItem(CLAVE_USUARIOS);
            return guardado ? JSON.parse(guardado) : usuariosPorDefecto.slice();
        } catch (e) {
            return usuariosPorDefecto.slice();
        }
    };
 
    const guardarUsuarios = (lista) => {
        try { localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista)); } catch (e) { /* almacenamiento no disponible */ }
    };
 
    /* ---------- REGIÓN / COMUNA ---------- */
 
    // Llena el <select> de región con las claves de `regiones`, y deja
    // listo el <select> de comuna para que se actualice solo cuando
    // cambie la región. Devuelve la función poblarComunas por si se
    // necesita llamar manualmente (por ejemplo al precargar un usuario).
    const enlazarRegionComuna = (selectRegion, selectComuna) => {
        selectRegion.innerHTML = '';
        Object.keys(regiones).forEach(region => {
            const opt = document.createElement('option');
            opt.value = region;
            opt.textContent = region;
            selectRegion.appendChild(opt);
        });
 
        const poblarComunas = (region) => {
            selectComuna.innerHTML = '';
            (regiones[region] || []).forEach(comuna => {
                const opt = document.createElement('option');
                opt.value = comuna;
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
        };
 
        selectRegion.addEventListener('change', () => poblarComunas(selectRegion.value));
        poblarComunas(selectRegion.value);
 
        return poblarComunas;
    };
 
    return {
        requireAdminSession,
        setupLogout,
        formatoCLP,
        cargarProductos,
        guardarProductos,
        cargarUsuarios,
        guardarUsuarios,
        regiones,
        enlazarRegionComuna
    };
})();
 
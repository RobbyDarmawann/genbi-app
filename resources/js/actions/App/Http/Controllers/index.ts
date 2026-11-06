import Public from './Public'
import Admin from './Admin'
import Mahasiswa from './Mahasiswa'
import KehadiranFotoController from './KehadiranFotoController'
import KoreksiBuktiController from './KoreksiBuktiController'
import Settings from './Settings'
const Controllers = {
    Public: Object.assign(Public, Public),
Admin: Object.assign(Admin, Admin),
Mahasiswa: Object.assign(Mahasiswa, Mahasiswa),
KehadiranFotoController: Object.assign(KehadiranFotoController, KehadiranFotoController),
KoreksiBuktiController: Object.assign(KoreksiBuktiController, KoreksiBuktiController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers
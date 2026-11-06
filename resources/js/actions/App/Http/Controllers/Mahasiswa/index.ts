import DashboardController from './DashboardController'
import BiodataController from './BiodataController'
import KegiatanController from './KegiatanController'
import AbsensiController from './AbsensiController'
import RiwayatController from './RiwayatController'
import KoreksiController from './KoreksiController'
const Mahasiswa = {
    DashboardController: Object.assign(DashboardController, DashboardController),
BiodataController: Object.assign(BiodataController, BiodataController),
KegiatanController: Object.assign(KegiatanController, KegiatanController),
AbsensiController: Object.assign(AbsensiController, AbsensiController),
RiwayatController: Object.assign(RiwayatController, RiwayatController),
KoreksiController: Object.assign(KoreksiController, KoreksiController),
}

export default Mahasiswa
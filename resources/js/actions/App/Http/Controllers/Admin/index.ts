import DashboardController from './DashboardController'
import KegiatanController from './KegiatanController'
import PesertaKegiatanController from './PesertaKegiatanController'
import MonitoringKegiatanController from './MonitoringKegiatanController'
import MahasiswaController from './MahasiswaController'
import PeriodeController from './PeriodeController'
import KomsatController from './KomsatController'
import DivisiController from './DivisiController'
import KoreksiController from './KoreksiController'
import RekapController from './RekapController'
import KepengurusanController from './KepengurusanController'
const Admin = {
    DashboardController: Object.assign(DashboardController, DashboardController),
KegiatanController: Object.assign(KegiatanController, KegiatanController),
PesertaKegiatanController: Object.assign(PesertaKegiatanController, PesertaKegiatanController),
MonitoringKegiatanController: Object.assign(MonitoringKegiatanController, MonitoringKegiatanController),
MahasiswaController: Object.assign(MahasiswaController, MahasiswaController),
PeriodeController: Object.assign(PeriodeController, PeriodeController),
KomsatController: Object.assign(KomsatController, KomsatController),
DivisiController: Object.assign(DivisiController, DivisiController),
KoreksiController: Object.assign(KoreksiController, KoreksiController),
RekapController: Object.assign(RekapController, RekapController),
KepengurusanController: Object.assign(KepengurusanController, KepengurusanController),
}

export default Admin
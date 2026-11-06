import HomeController from './HomeController'
import JadwalController from './JadwalController'
import StatistikController from './StatistikController'
import KepengurusanController from './KepengurusanController'
const Public = {
    HomeController: Object.assign(HomeController, HomeController),
JadwalController: Object.assign(JadwalController, JadwalController),
StatistikController: Object.assign(StatistikController, StatistikController),
KepengurusanController: Object.assign(KepengurusanController, KepengurusanController),
}

export default Public
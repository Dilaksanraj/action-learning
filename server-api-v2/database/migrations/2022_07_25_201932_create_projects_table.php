<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->text('desc');
            $table->date('end_date');
            $table->softDeletes();
            $table->timestamps();

            // $table->softDeletes();
            // $table->foreign('department_id')
            //     ->references('id')
            //     ->on('departments')
            //     ->onDelete('cascade');

            // $table->foreign('intake_id')
            //     ->references('id')
            //     ->on('intakes')
            //     ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
};

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
        Schema::create('invitations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('email');
            $table->enum('is_staff', array(0, 1))->default(0); //0 - no, 1-yes
            $table->enum('admin_privileges', array(0, 1))->default(0); //0 - no, 1-yes


            $table->unsignedBigInteger('department_id')->index();
            $table->unsignedBigInteger('intake_id')->nullable()->default(null)->index();

            $table->string('token');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->softDeletes();
            $table->foreign('department_id')
                ->references('id')
                ->on('departments')
                ->onDelete('cascade');

            $table->foreign('intake_id')
                ->references('id')
                ->on('intakes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invitations');
    }
};
